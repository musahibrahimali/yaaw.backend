import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpStatus, 
    Param, 
    Patch, 
    Post, 
    Request, 
    Response, 
    UploadedFile, 
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ProfileInfoDto } from './dto/profile.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { boolean } from 'joi';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard, FacebookAuthGuard,JwtAuthGuard } from 'src/authorization/authorizations';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IEducation, IJobExperience, IPost } from 'src/interface/interfaces';
import { JobExperienceDto } from 'src/jobexperience/dto/job.experience.dto';
import { CreateEducationDto } from 'src/education/dto/education.dto';
import { CreatePostDto } from 'src/post/dto/create.post.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ){}

    //* create a user
    @ApiCreatedResponse({type: String})
    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto, @Response({passthrough: true}) response): Promise<{access_token: string}>{
        const domain = this.configService.get("DOMAIN");
        const token = await this.userService.registerUser(createUserDto);
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    //* login user
    @ApiCreatedResponse({type: String})
    @Post('login')
    async loginUser(@Body() createUserDto: CreateUserDto, @Response({passthrough: true}) response):Promise<{access_token: string}>{
        const client = await this.userService.validateClient(createUserDto);
        const token = await this.userService.loginUser(client);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        return {access_token : token};
    }

    //* google authentication
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    //* google callback
    @ApiCreatedResponse({type: String})
    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleCallback(@Request() request, @Response({passthrough: true}) response):Promise<any>{
        const originUrl = this.configService.get("ORIGIN_URL");
        const token = await this.userService.signToken(request.user);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        // redirect to home page
        response.redirect(`${originUrl}/home`);
    }

    //* facebook auth
    @Get("facebook")
    @UseGuards(FacebookAuthGuard)
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    //* facebook callback
    @ApiCreatedResponse({type: String})
    @Get('facebook/callback')
    async facebookCallback(@Request() request, @Response({passthrough: true}) response):Promise<{access_token: string}>{
        const token = await this.userService.signToken(request.user);
        const domain = this.configService.get("DOMAIN");
        response.cookie('access_token', token, {
            domain: domain,
            httpOnly: true,
        });
        response.redirect('/');
        return {access_token : token};
    }

    //* update profile picture
    @ApiCreatedResponse({type: String})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile-picture/:id')
    @UseInterceptors(FileInterceptor('profilePicture'))
    async updateProfilePicture(@Param('id') id: string, @UploadedFile() file: Express.Multer.File | any):Promise<string>{
        const fileId: string = file.id;
        return this.userService.setNewProfilePicture(id, fileId);
    }

    //* update profile
    @ApiCreatedResponse({type: ProfileInfoDto})
    @UseGuards(JwtAuthGuard)
    @Patch('update-profile:/id')
    async updateUserProfile(@Param("id") id: string, @Body() updateCLientDto: CreateUserDto): Promise<ProfileInfoDto>{
        return this.userService.updateProfile(id, updateCLientDto);
    }

    //* get the user profile information
    @ApiCreatedResponse({type: ProfileInfoDto})
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() request):Promise<ProfileInfoDto> {
        const {userId} = request.user;
        return this.userService.getProfile(userId);
    }

    //* delete profile picture
    @ApiCreatedResponse({type: boolean})
    @UseGuards(JwtAuthGuard)
    @Patch('delete-profile-picture/:id')
    async deleteProfilePicture(@Param("id") id: string):Promise<boolean>{
        return this.userService.deleteProfilePicture(id);
    }

    //* log out user
    @ApiCreatedResponse({type: null})
    @Get('logout')
    async logoutUser(@Response({passthrough: true}) response): Promise<null>{
        response.cookie('access_token', '', { maxAge: 1 });
        response.redirect('/');
        return null;
    }

    //* delete user account
    @ApiCreatedResponse({type: boolean})
    @UseGuards(JwtAuthGuard)
    @Delete('delete-user/:id')
    async deleteUserData(@Param("id") id: string, @Response({passthrough: true}) response): Promise<boolean>{
        response.cookie('access_token', '', { maxAge: 1 });
        return this.userService.deleteUserData(id);
    }

    //* create job experience
    @Post('job-experience')
    async createJobExperience(@Body() createJobExperienceDto: JobExperienceDto): Promise<IJobExperience>{
        return this.userService.createExperience(createJobExperienceDto);
    }

    //* get all job experience
    @Get('job-experience')
    async getAllJobExperience(): Promise<IJobExperience[]>{
        return this.userService.getAllExperiences();
    }

    //* update job experience
    @Patch('job-experience/:id')
    async updateJobExperience(@Param("id") id: string, @Body() updateJobExperienceDto: JobExperienceDto): Promise<IJobExperience>{
        return this.userService.updateExperience(id, updateJobExperienceDto);
    }

    //* delete job experience
    @Delete('job-experience/:id')
    async deleteJobExperience(@Param("id") id: string): Promise<boolean>{
        return this.userService.deleteExperience(id);
    }

    //* create education
    @Post('education')
    async createEducation(@Body() createEducationDto: CreateEducationDto): Promise<IEducation>{
        return this.userService.createEducation(createEducationDto);
    }

    //* get all education
    @Get('education')
    async getAllEducation(): Promise<IEducation[]>{
        return this.userService.getAllEducations();
    }

    //* update education
    @Patch('education/:id')
    async updateEducation(@Param("id") id: string, @Body() updateEducationDto: CreateEducationDto): Promise<IEducation>{
        return this.userService.updateEducation(id, updateEducationDto);
    }

    //* delete education
    @Delete('education/:id')
    async deleteEducation(@Param("id") id: string): Promise<boolean>{
        return this.userService.deleteEducation(id);
    }

    //* create post
    @Post('post')
    async createPost(@Body() createPostDto: CreatePostDto): Promise<IPost>{
        return this.userService.createPost(createPostDto);
    }

    //* get all post
    @Get('post')
    async getAllPost(): Promise<IPost[]>{
        return this.userService.getAllPosts();
    }

    //* update post
    @Patch('post/:id')
    async updatePost(@Param("id") id: string, @Body() updatePostDto: CreatePostDto): Promise<IPost>{
        return this.userService.updatePost(id, updatePostDto);
    }

    //* delete post
    @Delete('post/:id')
    async deletePost(@Param("id") id: string): Promise<boolean>{
        return this.userService.deletePost(id);
    }
}
