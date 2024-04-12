class UserModel {
    public name: string;
    public email: string;
    public password: string;
    public age: number;
    private token: string;
    public role: string;

    constructor(name: string, email: string, password: string, age: number) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.age = age;
    }
}