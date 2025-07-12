import {Router} from 'express'
import {z} from 'zod'
import jwt from 'jsonwebtoken'
import {User, Skill, Swap} from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = Router()

const authSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

userRouter.post('/signup', async (req, res)=>{
    try {
        const body = req.body
        const {success} = authSchema.safeParse(body)
        if (!success){
            return res.status(400).json({
                message: "Invalid Input"
            })
        }

        const existingEmail = await User.findOne({email: body.email})
        if (existingEmail){
            return res.status(400).json({
                message: "A user with this email already exists.",
            });
        }

        const newUser = await User.create({
            email: body.email,
            password: body.password,
        })
        const id = newUser._id

        const token = jwt.sign({
            id:id
        }, "secret")

        res.json({
            message: "signed up",
            userId: id,
            token
        });
    }catch(e){
        console.error(e)
        res.status(500).json({ message: "Internal server error" });
    }
})

userRouter.post('/login', async (req, res)=>{
    try {
        const body = req.body
        const {success} = authSchema.safeParse(body)
        if (!success) {
            return res.status(400).json({
                message: "Invalid Inputs"
            })
        }

        const existingUser = await User.findOne({email: body.email})
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist"
            })
        }

        const verifyPassword = ()=>{
            return existingUser.password === body.password;
        }
        if (!verifyPassword()){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({
            id: existingUser._id
        }, "secret")

        return res.json({
            message: 'Login successful',
            userId: existingUser._id,
            token
        });
    }catch(e){
        console.error(e)
        res.status(500).json({ message: "Internal server error" });
    }
})

userRouter.get('/profile', authMiddleware, async (req, res)=>{
    try{
        const userProfile = await User.findOne({
            _id: req.userId
        })
            .populate('skills_offered')
            .populate('skill_wanted')
            .select('-password');

        res.status(200).json({
            userProfile
        });

    }catch(e){
        console.error(e)
        res.status(500).json({
            message: "An error occurred while fetching content.",
            error: e.message
        });
    }
})


const editProfileSchema = z.object({
    name: z.string().min(4).optional(),
    location: z.enum(['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata']).optional(),
    availability: z.enum(['weekends', 'weekdays']).optional(),
    status: z.enum(['Public', 'Private']).optional(),
    skills_offered: z.array(z.string().trim()).optional(),
    skill_wanted: z.array(z.string().trim()).optional()
});

async function getOrCreateSkills(titles) {
    const skillIds = [];
    for (const title of titles) {
        let skill = await Skill.findOne({ title });
        if (!skill) {
            skill = await Skill.create({ title });
        }
        skillIds.push(skill._id);
    }
    return skillIds;
}

userRouter.post('/edit-profile', authMiddleware, async (req, res)=>{
    try{
        const body = req.body;

        const parsed = editProfileSchema.safeParse(body);
        if (!parsed.success) {
            return res.status(400).json({ message: 'Invalid profile update data' });
        }

        const updateData = { ...parsed.data };

        if (updateData.skills_offered) {
            updateData.skills_offered = await getOrCreateSkills(updateData.skills_offered);
        }

        if (updateData.skill_wanted) {
            updateData.skill_wanted = await getOrCreateSkills(updateData.skill_wanted);
        }


        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateData },
            { new: true }
        )
            .populate('skills_offered')
            .populate('skill_wanted')
            .select('-password');

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while updating profile', error: e.message });
    }
})

async function getExistingSkills(titles) {
    const skillDocs = await Skill.find({ title: { $in: titles } });

    if (skillDocs.length !== titles.length) {
        const foundTitles = skillDocs.map(s => s.title);
        const missing = titles.filter(t => !foundTitles.includes(t));
        throw new Error(`Skill(s) not found: ${missing.join(', ')}`);
    }

    return skillDocs.map(skill => skill._id);
}

const swapTriggerSchema = z.object({
    skills_offered: z.array(z.string()).min(1),
    skill_wanted: z.array(z.string()).min(1),
});

userRouter.post('/swap-trigger', authMiddleware, async (req, res) => {
    try {
        const validation = swapTriggerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: 'Invalid input', error: validation.error });
        }

        const { skills_offered, skill_wanted } = validation.data;

        const skillsOfferedIds = await getOrCreateSkills(skills_offered);
        const skillsWantedIds = await getOrCreateSkills(skill_wanted);

        const newSwap = await Swap.create({
            initiator: req.userId,
            targetUser: null, // make it optional
            skills_offered: skillsOfferedIds,
            skill_wanted: skillsWantedIds,
            status: 'pending'
        });

        return res.status(201).json({
            message: 'Swap broadcast created successfully',
            swap: newSwap
        });

    } catch (e) {
        console.error('Swap Trigger Error:', e);
        return res.status(400).json({
            message: e.message || 'An error occurred',
        });
    }
});


userRouter.get('/swap', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [swaps, total] = await Promise.all([
            Swap.find({
                $or: [{ initiator: userId }, { targetUser: userId }]
            })
                .populate('initiator', 'email name')
                .populate('targetUser', 'email name')
                .populate('skills_offered', 'title')
                .populate('skill_wanted', 'title')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Swap.countDocuments({
                $or: [{ initiator: userId }, { targetUser: userId }]
            })
        ]);

        res.status(200).json({
            message: "Fetched swap requests",
            swaps,
            page,
            totalPages: Math.ceil(total / limit),
            totalSwaps: total
        });
    } catch (e) {
        console.error('Fetch Swaps Error:', e);
        res.status(500).json({ message: "Failed to fetch swaps", error: e.message });
    }
});

userRouter.get('/swap/public', async (req, res) => {
    try {
        const ok = 'ok'
        const swaps = await Swap.find({ targetUser: null }) // show broadcasted only
            .populate('initiator', 'name')
            .populate('skills_offered', 'title')
            .populate('skill_wanted', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Broadcasted swaps", swaps });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch", error: e.message });
    }
});

userRouter.get('/swap-feed', async (req, res) => {
    try {
        const swaps = await Swap.find({ targetUser: null })
            .populate('initiator', 'name')
            .populate('skills_offered', 'title')
            .populate('skill_wanted', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Broadcast swaps", swaps });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch", error: e.message });
    }
});



userRouter.post('/propose-swap', authMiddleware, async (req, res) => {
    try {
        const { originalSwapId } = req.body;

        if (!originalSwapId) {
            return res.status(400).json({ message: "Missing originalSwapId" });
        }

        const original = await Swap.findById(originalSwapId);
        if (!original || !original.initiator) {
            return res.status(404).json({ message: "Original swap not found or invalid" });
        }

        if (original.initiator.toString() === req.userId) {
            return res.status(403).json({ message: "You cannot propose swap to yourself" });
        }

        const newSwap = await Swap.create({
            initiator: req.userId,
            targetUser: original.initiator,
            skills_offered: original.skill_wanted,
            skill_wanted: original.skills_offered,
            status: 'pending',
            proposedFrom: original._id
        });

        return res.status(201).json({
            message: 'Swap proposed successfully',
            swap: newSwap
        });

    } catch (e) {
        console.error('Propose Swap Error:', e);
        return res.status(500).json({ message: "Failed to propose swap", error: e.message });
    }
});




export default userRouter