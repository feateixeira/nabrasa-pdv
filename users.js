const users = {
    admin: {
        username: 'admin',
        password: 'admin2030',
        role: 'admin'
    },
    func1: {
        username: 'func1',
        password: 'func123',
        role: 'employee'
    },
    func2: {
        username: 'func2',
        password: 'func456',
        role: 'employee'
    }
};

function authenticateUser(username, password) {
    const user = Object.values(users).find(u => u.username === username && u.password === password);
    return user || null;
}

function isAdmin(user) {
    return user && user.role === 'admin';
} 