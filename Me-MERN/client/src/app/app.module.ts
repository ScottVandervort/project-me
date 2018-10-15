import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ViewContainerComponent } from './view-container/view-container.component';
import { AppRoutingModule } from './app-routing.module';
import { ViewComponent } from './views/view/view.component';
import { NewViewSelectorComponent } from './new-view-selector/new-view-selector.component';
import { ViewEditorComponent } from './view-editors/view-editor/view-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ViewContainerComponent,
    ViewComponent,
    NewViewSelectorComponent,
    ViewEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
