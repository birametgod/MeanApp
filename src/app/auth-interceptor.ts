import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService : UserService){}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.userService.getToken();
    const authToken = req.clone({
      headers : req.headers.set('Authorization','Bearer '+ token)
    })
    return next.handle(authToken);
  }
}
