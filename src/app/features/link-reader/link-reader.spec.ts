import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkReader } from './link-reader';

describe('LinkReader', () => {
  let component: LinkReader;
  let fixture: ComponentFixture<LinkReader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkReader],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkReader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
