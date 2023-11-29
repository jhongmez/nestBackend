import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterDto } from './dto/index';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	
	@Post()
	create(@Body() CreateUserDto: CreateUserDto) {
		return this.authService.create(CreateUserDto);
	}

	@Post('/login')
	login( @Body() LoginDto: LoginDto ) {
		return this.authService.login( LoginDto )
	}

	@Post('/register')
	register( @Body() RegisterDto: RegisterDto ) {
		return this.authService.register( RegisterDto )
	}
	
	@UseGuards( AuthGuard )
	@Get()
	findAll( @Request() req: Request ) {
		// const user = req['user']
		// return user;
		return this.authService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.authService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
		return this.authService.update(+id, updateAuthDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.authService.remove(+id);
	}
}
