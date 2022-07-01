import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {OAuthModule} from 'angular-oauth2-oidc';
import {SharedModule} from 'src/app/shared/shared.module';

import {CoreRoutingModule} from './core-routing.module';
import {EntryUserComponent} from './user/entry-user/entry-user.component';
import {UserComponent} from './user/user.component';


@NgModule({
  declarations: [
    UserComponent,
    EntryUserComponent,
  ],
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,


    // Author
    SharedModule,
    CoreRoutingModule,
    OAuthModule.forRoot(),
  ],
})
export class CoreModule {
}
