import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WifiViewComponent } from './wifi-view.component';

describe('WifiViewComponent', () => {
  let component: WifiViewComponent;
  let fixture: ComponentFixture<WifiViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WifiViewComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WifiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
