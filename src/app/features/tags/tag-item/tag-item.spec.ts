import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagItem } from './tag-item';

describe('TagItem', () => {
  let component: TagItem;
  let fixture: ComponentFixture<TagItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagItem],
    }).compileComponents();

    fixture = TestBed.createComponent(TagItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
