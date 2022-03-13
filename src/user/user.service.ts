import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { IEducation, IJobExperience, IPost, IUser } from 'src/interface/interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileInfoDto } from './dto/profile.response.dto';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { EducationService } from 'src/education/education.service';
import { JobExperienceService } from 'src/jobexperience/jobexperience.service';
import * as bcrypt from 'bcrypt';
import { CreatePostDto } from 'src/post/dto/create.post.dto';
import { CreateEducationDto } from 'src/education/dto/education.dto';
import { JobExperienceDto } from 'src/jobexperience/dto/job.experience.dto';
import mongoose from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserModel>,
        private jwtService: JwtService,
        private postService: PostService,
        private educationService: EducationService,
        private jobExperienceService: JobExperienceService,
    ){}

    // register client
    async registerUser(createUserDto: CreateUserDto): Promise<string>{
        try{
            createUserDto.email = createUserDto.username;
            createUserDto.displayName = createUserDto.firstName + " " + createUserDto.lastName;
            const _user = await this.creaateClient(createUserDto);
            if(_user._id){
                const payload = { username: _user.username, sub: _user._id };
                return this.jwtService.sign(payload);
            }
        }catch(error){
            return error;
        }
    }

    // log in user
    async loginUser(user:IUser): Promise<string>{
        try{
            const payload = { username: user.email, sub: user._id };
            return this.jwtService.sign(payload);
        }catch(error){
            return error;
        }
    }

    // update client profile
    async updateProfile(id: string, updateUserDto: CreateUserDto):Promise<ProfileInfoDto>{
        return this.updateUserProfile(id, updateUserDto);
    }

    // get user profile
    async getProfile(id: string): Promise<ProfileInfoDto>{
        const user = await this.getUserProfile(id);
        if(user === undefined) {
            return undefined;
        }
        return user;
    }

    // update profile picture
    async setNewProfilePicture(id: string, newPicture: string): Promise<string>{
        const user = await this.updateUserProfilePicture(id, newPicture);
        return user;
    }

    // delete profile picture
    async deleteProfilePicture(userId:string):Promise<boolean>{
        try{
            const _user = await this.userModel.findOne({_id: userId})
            // update the profile image
            // const isDeleted = await this.deleteFile(_client.image);
            _user.image = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            _user.save();
            return true;
        }catch(error){
            return false;
        }
    }

    // delete user data from database
    async deleteUserData(id:string): Promise<boolean>{
        // const client = await this.userModel.findOne({_id: id});
        // delete all images 
        // await this.deleteFile(client.image);
        // find and delete the client
        const _user = await this.userModel.findOneAndDelete({_id: id});
        if(_user){
            return true;
        }
        return false;
    }

    // validate client
    async validateClient(createClientDto: CreateUserDto):Promise<IUser>{
        const user = await this.findOne( createClientDto.username, createClientDto.password);
        if(!user) {
            return undefined;
        }
        return user;
    }

    // validate google user
    async validateSocialUser(socialId: string, user:CreateUserDto): Promise<IUser | any>{
        const _user = await this.userModel.findOne({socialId: socialId});
        if(_user) {
            return _user;
        }
        return await this.userModel.create(user);
    }

    // sign token for social login
    async signToken(user: IUser): Promise<string> {
        const payload = { username: user.username, sub: user._id };
        return this.jwtService.sign(payload);
    }

    /* Private methods */

    // hash the password
    private async hashPassword(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    // create a new client
    private async creaateClient(createClientDto: CreateUserDto): Promise<IUser | any> {
        try{
            // check if email already exists
            const emailExists = await this.userModel.findOne({username: createClientDto.username});
            if(emailExists){
                return {
                    status: "error",
                    message: "Email already exists"
                }
            }
            const saltRounds = 10;
            // generate salt 
            createClientDto.salt = await bcrypt.genSalt(saltRounds);
            // hash the password
            const hashedPassword = await this.hashPassword(createClientDto.password, createClientDto.salt);
            // add the new password and salt to the dto
            createClientDto.password = hashedPassword;
            // create a new user
            const createdClient = new this.userModel(createClientDto);
            return await createdClient.save();
        }catch(error){
            return {
                message: error.message
            }
        }
    }

    // find one client (user)
    private async findOne(email: string, password:string): Promise<ProfileInfoDto | any> {
        try{
            const client = await this.userModel.findOne({username: email});
            if(!client) {
                return undefined;
            }
            // compare passwords
            const isPasswordValid = await bcrypt.compare(password, client.password);
            if(!isPasswordValid) {
                return null;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(client.image === defaultImage){
                profileImage = defaultImage;
            }else if(client.socialId.length > 0) {
                profileImage = client.image;
            }else{
                // profileImage = await Promise.resolve(this.readStream(client.image));
            }
            const userData = {
                ...client.toObject(),
                image : profileImage,
                password: "",
                salt: "",
            }
            return userData;
        }catch(err){
            return undefined;
        }
    }

    // get the profile of a  client (user)
    private async getUserProfile(id: string): Promise<IUser | any> {
        try{
            const client = await this.userModel.findOne({_id: id});
            if(!client) {
                return undefined;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(client.image === defaultImage){
                profileImage = defaultImage;
            }else if(client.socialId.length > 0){
                profileImage = client.image;
            }else{
                // profileImage = await Promise.resolve(this.readStream(client.image));
            }
            const userData = {
                ...client.toObject(),
                image : profileImage,
                password: "",
                salt: "",
            }
            return userData;
        }catch(err){
            return undefined;
        }
    }

    // update profile picture
    private async updateUserProfilePicture(id: string, picture: string): Promise<string>{
        const client = await this.userModel.findOne({_id: id});
        if(client.image === "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"){
            // update the client image to the new picture
            client.image = picture;
        }else{
            // delete the old picture from database
            // await this.deleteFile(client.image);
            // update the client image to the new picture
            client.image = picture;
        }
        // save to database
        const updatedCLient = await client.save();
        return updatedCLient.image;
    }

    // update profile
    private async updateUserProfile(id: string, updateClientDto: CreateUserDto): Promise<ProfileInfoDto>{
        // find and update the client
        await this.userModel.findOneAndUpdate({_id: id}, updateClientDto, {new: true});
        const userData = await this.getUserProfile(id);
        return userData;
    }

    //* followers

    //* post services
    // create post
    async createPost(post: CreatePostDto): Promise<IPost | any>{
        return await this.postService.create(post);
    }

    // get all posts
    async getAllPosts(): Promise<IPost[] | any>{
        return await this.postService.findAll();
    }

    // update post
    async updatePost(id: string, post: CreatePostDto): Promise<IPost | any>{
        return await this.postService.update(post, id);
    }

    // delete post
    async deletePost(id: string): Promise<IPost | any>{
        return await this.postService.delete(id);
    }

    //* education services
    // create education
    async createEducation(education: CreateEducationDto): Promise<IEducation | any>{
        return await this.educationService.create(education);
    }

    // get all educations
    async getAllEducations(): Promise<IEducation[] | any>{
        return await this.educationService.findAll();
    }

    // update education
    async updateEducation(id: string, education: CreateEducationDto): Promise<IEducation | any>{
        return await this.educationService.update(education, id);
    }

    // delete education
    async deleteEducation(id: string): Promise<IEducation | any>{
        return await this.educationService.delete(id);
    }

    //* experience services
    // create experience
    async createExperience(experience: JobExperienceDto): Promise<IJobExperience | any>{
        return await this.jobExperienceService.create(experience);
    }

    // get all experiences
    async getAllExperiences(): Promise<IJobExperience[] | any>{
        return await this.jobExperienceService.findAll();
    }

    // update experience
    async updateExperience(id: string, experience: JobExperienceDto): Promise<IJobExperience | any>{
        return await this.jobExperienceService.update(experience, id);
    }

    // delete experience
    async deleteExperience(id: string): Promise<IJobExperience | any>{
        return await this.jobExperienceService.delete(id);
    }

}
