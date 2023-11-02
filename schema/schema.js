const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLSchema } = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Todo = require('../models/todoModel');
const User = require('../models/userModel');
const config = require('../config/keys');
const verifyTokenMiddleware = require('../middlewares/authenticator');

const AuthPayloadType = new GraphQLObjectType({
    name: 'AuthPayload',
    fields: () => ({
        token: { type: GraphQLString },
        status: { type: GraphQLString },
        message: { type: GraphQLString },
        user: { type: UserType },
    }),
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        fullName: { type: GraphQLString },
        token: { type: GraphQLString },
        email: { type: GraphQLString },
        members: { type: new GraphQLList(GraphQLString) },
    }),
});

const TodoType = new GraphQLObjectType({
    name: 'Todo',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        date: { type: GraphQLString },
        category: { type: GraphQLString },
        user: { type: GraphQLString },
        members: { type: new GraphQLList(GraphQLString) },
        comments: { type: new GraphQLList(GraphQLString) },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        todo: {
            type: TodoType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Todo.findById(args.id);
            },
        },
        todos: {
            type: new GraphQLList(TodoType),
            resolve(parent, args, context) {
                let { userId, email } = verifyTokenMiddleware(context);
                console.log(userId, email)
                if (userId) {
                    return Todo.find({
                        $or: [
                            { user: userId },
                            { members: { $in: email } },
                        ],
                    });
                } else {
                    return {};
                }
            },
        },
        users: {
            type: new GraphQLList(TodoType),
            resolve(parent, args, context) {
                let { userId } = verifyTokenMiddleware(context);
                if (userId) {
                    return User.find({});
                } else {
                    return {};
                }
            },
        },
        getUser: {
            type: new GraphQLList(UserType),
            resolve(parent, args, context) {
                let { userId } = verifyTokenMiddleware(context);
                if (userId) {
                    return User.find({ _id: userId });
                } else {
                    return {};
                }
            },
        },
        searchMember: {
            type: new GraphQLList(UserType), // Add a new query 'searchMember'
            args: {
                member: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args, context) {
                let { userId } = verifyTokenMiddleware(context);
                if (userId) {
                    return User.find({ email: { $regex: args.member, $options: 'i' } });
                } else {
                    throw new Error('Authentication failed');
                }
            },
        },
        // },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTodo: {
            type: TodoType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: new GraphQLNonNull(GraphQLString) },
                date: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: ((parent, args, context) => {
                let { userId, email } = verifyTokenMiddleware(context);
                if (userId) {
                    const todo = new Todo({
                        title: args.title,
                        category: args.category,
                        date: args.date,
                        user: userId,
                        members: [email],

                    });
                    return todo.save();
                }
                else {
                    throw new Error('Todo not found or not owned by the authenticated user');
                }
            }),
        },
        updateTodo: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                category: { type: new GraphQLNonNull(GraphQLString) },
                date: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args, context) {
                let { userId } = verifyTokenMiddleware(context);
                if (userId) {
                    const updateFields = {};
                    if (args.title) {
                        updateFields.title = args.title;
                    }
                    if (args.date) {
                        updateFields.date = args.date;
                    }
                    if (args.category) {
                        updateFields.category = args.category;
                    }
                    return Todo.findByIdAndUpdate(args.id, updateFields, { new: true });
                }
                else {
                    throw new Error('Todo not found or not owned by the authenticated user');
                }
            },
        },
        updateTodoCategory: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                category: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args, context) {
                let { userId } = verifyTokenMiddleware(context);
                if (userId) {
                    const updateFields = {};
                    if (args.category) {
                        updateFields.category = args.category;
                    }
                    return Todo.findByIdAndUpdate(args.id, updateFields, { new: true });
                }
                else {
                    throw new Error('Todo not found or not owned by the authenticated user');
                }
            },
        },
        updateTodoComments: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                comments: { type: new GraphQLList(GraphQLString) },
            },
            resolve(parent, args, context) {
                let { userId } = verifyTokenMiddleware(context);
                if (userId) {
                    return Todo.findByIdAndUpdate(args.id, { comments: args.comments }, { new: true });
                }
                else {
                    throw new Error('Todo not found or not owned by the authenticated user');
                }
            },
        },
        deleteTodo: {
            type: TodoType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args, context) {
                // Verify the user's token using your authentication middleware
                const { userId } = verifyTokenMiddleware(context);

                if (!userId) {
                    throw new Error('Authentication failed');
                }

                // Check if the todo exists and belongs to the authenticated user
                return Todo.findOne({ _id: args.id })
                    .then((todo) => {
                        if (!todo) {
                            throw new Error('Todo not found or not owned by the authenticated user');
                        }

                        // If it exists and belongs to the user, delete it
                        return Todo.findByIdAndRemove(args.id);
                    })
                    .then((deletedTodo) => {
                        if (!deletedTodo) {
                            throw new Error('Failed to delete the todo');
                        }

                        return deletedTodo;
                    })
                    .catch((error) => {
                        throw error;
                    });
            },
        },
        updateTodosMembers: {
            type: GraphQLString, // Return a message indicating the update was successful
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                member: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args, context) {
                let { userId } = verifyTokenMiddleware(context);
                if (userId) {
                    if (userId !== args.userId) {
                        throw new Error('Not authorized to update todos');
                    }

                    // Find todos owned by the user
                    return Todo.find({ user: args.userId })
                        .then((todos) => {
                            if (todos.length === 0) {
                                throw new Error('No todos found for the user');
                            }

                            // Update the members array for each todo
                            const updatePromises = todos.map((todo) => {
                                todo.members.push(args.member); // Add the member to the array
                                return todo.save();
                            });

                            return Promise.all(updatePromises);
                        })
                        .then(() => {
                            return 'Members updated successfully';
                        })
                        .catch((error) => {
                            throw error;
                        });
                } else {
                    throw new Error('Authentication failed');
                }
            },
        },
        signUp: {
            type: UserType,
            args: {
                fullName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return User.findOne({ email: args.email })
                    .then(existingUser => {
                        if (existingUser) {
                            throw new Error('User already exists');
                        }
                        return bcrypt.hash(args.password, 10);
                    })
                    .then(hash => {
                        const user = new User({
                            fullName: args.fullName,
                            email: args.email,
                            password: hash,
                        });
                        return user.save();
                    })
                    .then(user => {
                        return user;
                    })
                    .catch(err => {
                        throw err;
                    });
            },
        },
        login: {
            type: AuthPayloadType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                let user;
                return User.findOne({ email: args.email })
                    .then(foundUser => {
                        user = foundUser;
                        if (!user) {
                            return {
                                status: "error",
                                message: "User not found",
                                token: "1", // Include the token in the response
                                user: {
                                    id: user.id,
                                    fullName: user.fullName,
                                    email: user.email,
                                },
                            };
                            // throw new Error('User not found');
                        }
                        return bcrypt.compare(args.password, user.password);
                    })
                    .then(isValid => {
                        if (!isValid) {
                            console.log("first");
                            // throw new Error('Invalid password');
                            return {
                                status: "error",
                                message: "Invalid password",
                                token: "1", // Include the token in the response
                                user: {
                                    id: user.id,
                                    fullName: user.fullName,
                                    email: user.email,
                                },
                            };
                        } else {
                            const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: config.jwtExpire });
                            return {
                                status: "pass",
                                message: "Logged in successfully",
                                token: token, // Include the token in the response
                                user: {
                                    id: user.id,
                                    fullName: user.fullName,
                                    email: user.email,
                                },
                            };
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
