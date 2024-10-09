import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { firebaseConfig } from './firebase';




platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
