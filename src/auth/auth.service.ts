import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterDto } from './dto/index';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {
	
	constructor( 
		@InjectModel( User.name ) private userModel: Model<User>,
		private jwtService: JwtService
	) {}

	async create(CreateUserDto: CreateUserDto): Promise<User> {
		try {
			// * Destructuracion
			const { password, ...userData } = CreateUserDto;

			const newUser = new this.userModel({
				password: bcryptjs.hashSync( password, 10 ),
				...userData
			});

			await newUser.save();
			const { password:_, ...user } = newUser.toJSON();

			return user;

		} catch (error) {

			if ( error.code === 11000 ) {
				throw new BadRequestException(`${ CreateUserDto.email } already exists!`);
			}
			throw new InternalServerErrorException('Something terrible happen!');
			
		}
	}

	async register(registerDto: RegisterDto): Promise<LoginResponse> {
		const user = await this.create( registerDto )

		return {
			user: user,
			token: this.getJwtToken({ id: user._id })
		}
	}

	async login( LoginDto: LoginDto ): Promise<LoginResponse> {
		
		const { email, password } = LoginDto
		
		// * Comparar el correo electronico almacenado
		const user = await this.userModel.findOne({ email });
		if( !user ) {
			throw new UnauthorizedException('Not valid credentials - email')
		}
		
		// * Comparar la contraseña almacenada con la diligenciada
		if( !bcryptjs.compareSync( password, user.password ) ) {
			throw new UnauthorizedException('Not valid credentials - password')
		}

		const { password:_, ...resp } = user.toJSON();

		return {
			user: resp,
			token: this.getJwtToken({ id: user.id })
		}
	}

	getJwtToken( payload: JwtPayload) {
		const token = this.jwtService.sign( payload );
		return token;
	}

	findAll() {
		return `This action returns all auth`;
	}

	findOne(id: number) {
		return `This action returns a #${id} auth`;
	}

	update(id: number, updateAuthDto: UpdateAuthDto) {
		return `This action updates a #${id} auth`;
	}

	remove(id: number) {
		return `This action removes a #${id} auth`;
	}

}
