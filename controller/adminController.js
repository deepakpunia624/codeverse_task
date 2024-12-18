const User = require('../model/userSchema'); 

const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const adminUser = new User({
                userName: 'admin',
                name:"admin",
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin',
                isVerified:true
            });

            await adminUser.save();
            console.log('Default admin user created successfully');
        }
    } catch (error) {
        console.error('Error creating default admin:', error.message);
    }
};

module.exports = {
    createDefaultAdmin,
};

