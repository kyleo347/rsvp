import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './auth/auth.service';
import { CallbackComponent } from './pages/callback/callback.component';
import { ApiService } from './core/api.service';
import { LoadingComponent } from './core/loading.component';
import { UtilsService } from './core/utils.service';
import { FilterSortService } from './core/filter-sort.service';
import { AdminComponent } from './pages/admin/admin.component';
import { EventComponent } from './pages/event/event.component';
import { EventDetailComponent } from './pages/event/event-detail/event-detail.component';
import { RsvpComponent } from './pages/event/rsvp/rsvp.component';
import { RsvpFormComponent } from './pages/event/rsvp/rsvp-form/rsvp-form.component';
import { SubmittingComponent } from './core/forms/submitting.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CallbackComponent,
    LoadingComponent,
    AdminComponent,
    EventComponent,
    EventDetailComponent,
    RsvpComponent,
    RsvpFormComponent,
    SubmittingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    Title,
    AuthService,
    ApiService,
    DatePipe,
    UtilsService,
    FilterSortService,
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
