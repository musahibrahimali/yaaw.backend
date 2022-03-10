import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminModel } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { IAdmin } from 'src/interface/interfaces';
import { AdminProfileInfoDto } from './dto/admin.profile.response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<AdminModel>,
        private jwtService: JwtService,
    ){}

    // register new admin
    async registerAdmin(createAdminDto: CreateAdminDto): Promise<string> {
        try{
            const _admin = await this.creaateAdmin(createAdminDto);
            if(_admin._id){
                const payload = { username: _admin.username, sub: _admin._id };
                return this.jwtService.sign(payload);
            }
        }catch(error){
            return error; 
        }
    }

    // log in admin
    async loginAdmin(user:IAdmin): Promise<string> {
        try{
            const payload = { username: user.username, sub: user._id };
            return this.jwtService.sign(payload);
        }catch(error){
            return error;
        }
    }

    // update client profile
    async updateProfile(id: string, updateClientDto: CreateAdminDto):Promise<AdminProfileInfoDto>{
        return this.updateAdminProfile(id, updateClientDto);
    }

    // get user profile
    async getProfile(id: string): Promise<AdminProfileInfoDto>{
        const client = await this.getAdminProfile(id);
        if(client === undefined) {
            return undefined;
        }
        return client;
    }

    // update profile picture
    async setNewProfilePicture(id: string, newPicture: string): Promise<string>{
        const client = await this.updateAdminProfilePicture(id, newPicture);
        return client;
    }

    // delete profile picture
    async deleteProfilePicture(clientId:string):Promise<boolean>{
        try{
            const _admin = await this.adminModel.findOne({_id: clientId})
            // update the profile image
            // const isDeleted = await this.deleteFile(_admin.image);
            _admin.image = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            _admin.save();
            return true;
        }catch(error){
            return false;
        }
    }

    // delete client data from database
    async deleteAdminData(id:string): Promise<boolean>{
        // const admin = await this.adminModel.findOne({_id: id});
        // delete all images 
        // await this.deleteFile(admin.image);
        // find and delete the client
        const _admin = await this.adminModel.findOneAndDelete({_id: id});
        if(_admin){
            return true;
        }
        return false;
    }

    // validate client
    async validateAdmin(createAdminDto: CreateAdminDto):Promise<IAdmin>{
        const admin = await this.findOne( createAdminDto.username, createAdminDto.password);
        if(admin === undefined) {
            return undefined;
        }
        return admin;
    }


    /* Private methods */
    // hash the password
    private async hashPassword(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    // find one client (user)
    private async findOne(email: string, password:string): Promise<IAdmin | any> {
        try{
            const admin = await this.adminModel.findOne({username: email});
            if(!admin) {
                return undefined;
            }
            // compare passwords
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if(!isPasswordValid) {
                return null;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(admin.image === defaultImage){
                profileImage = defaultImage;
            }else{
                // profileImage = await Promise.resolve(this.readStream(admin.image));
            }
            const userData = {
                ...admin.toObject(),
                image : profileImage,
                password: "",
                salt: "",
            }
            return userData;
        }catch(error){
            return error;
        }
    }

    // get the profile of a  client (user)
    private async getAdminProfile(id: string): Promise<IAdmin | any> {
        try{
            const admin = await this.adminModel.findOne({_id: id});
            if(!admin) {
                return undefined;
            }
            const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            let profileImage: string;
            if(admin.image === defaultImage){
                profileImage = defaultImage;
            }else{
                // profileImage = await Promise.resolve(this.readStream(admin.image));
            }
            const userData = {
                ...admin.toObject(),
                image: profileImage,
                password: "",
                salt: ""
            }
            return userData;
        }catch(error){
            return undefined;
        }
    }

    // create a new admin
    private async creaateAdmin(createAdminDto: CreateAdminDto): Promise<IAdmin|any> {
        try{
            // check if email already exists
            const emailExists = await this.adminModel.findOne({email: createAdminDto.username});
            if(emailExists){
                return {
                    status: "error",
                    message: "Email already exists"
                }
            }
            const saltRounds = 10;
            // generate salt 
            createAdminDto.salt = await bcrypt.genSalt(saltRounds);
            // hash the password
            const hashedPassword = await this.hashPassword(createAdminDto.password, createAdminDto.salt);
            // add the new password and salt to the dto
            createAdminDto.password = hashedPassword;
            // create a new user
            const createdAdmin = new this.adminModel(createAdminDto);
            return await createdAdmin.save();
        }catch(error){
            return error;
        }
    }

    // update profile picture
    private async updateAdminProfilePicture(id: string, picture: string): Promise<string>{
        try{
            const admin = await this.adminModel.findOne({_id: id});
            if(admin.image === "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"){
                // update the client image to the new picture
                admin.image = picture;
            }else{
                // delete the old picture from database
                // await this.deleteFile(admin.image);
                // update the client image to the new picture
                admin.image = picture;
            }
            // save to database
            const updatedAdmin = await admin.save();
            return updatedAdmin.image;
        }catch(error){
            return error;
        }
    }

    // update profile
    private async updateAdminProfile(id: string, updateClientDto: CreateAdminDto): Promise<IAdmin | any>{
        try{
            // first find the admin
            const _admin = await this.adminModel.findOne({_id: id});
            // find and update the client
            if(updateClientDto.firstName && updateClientDto.lastName){
                updateClientDto.displayName = updateClientDto.firstName + ' ' + updateClientDto.lastName;
            }
            if(updateClientDto.firstName && updateClientDto.lastName.length < 0){
                updateClientDto.displayName = updateClientDto.firstName + ' ' + _admin.lastName;
            }
            if(updateClientDto.firstName.length < 0 && updateClientDto.lastName){
                updateClientDto.displayName = _admin.firstName + ' ' + updateClientDto.lastName;
            }
            // if password is not '' then update the password as well
            if(updateClientDto.password.length > 6){
                const hansedPassword = await this.hashPassword(updateClientDto.password, _admin.salt);
                updateClientDto.password = hansedPassword;
            }
            const updatedAdmin = await this.adminModel.findOneAndUpdate({_id: id}, updateClientDto, {new: true});
            const userData = {
                ...updatedAdmin.toObject(),
                password: "",
                salt: "",
            }
            return userData;
        }catch(error){
            return error;
        }
    }


}
