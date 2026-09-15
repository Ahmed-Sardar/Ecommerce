import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
    },
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: '786786',
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'user@example.com',
        password: 'password123',
        isAdmin: false,
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        isAdmin: false,
    },
];

export default users;
