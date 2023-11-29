import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor( 
		private JwtService: JwtService,
		private authService: AuthService
	) {}

	async canActivate( context: ExecutionContext ): Promise<boolean> {

		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request)

		if (!token) {
			throw new UnauthorizedException('There is no bearer token');
		}

		try {

			const payload = await this.JwtService.verifyAsync<JwtPayload>(
				token,
				{
					secret: process.env.JWT_SEED
				}
			);

			const user = await this.authService.findUserById( payload.id );

			if( !user ) throw new UnauthorizedException('user doesnt exist');
			if( !user.isActive ) throw new UnauthorizedException('user is not active');

			request['user'] = user;
			
		} catch (error) {
			throw new UnauthorizedException('Token unauthorized')
		}

		return true;
		
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers['authorization']?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

}
