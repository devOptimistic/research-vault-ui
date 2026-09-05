import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkCard } from './link-card';

describe('LinkCard', () => {
  let component: LinkCard;
  let fixture: ComponentFixture<LinkCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkCard],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
