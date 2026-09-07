import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebSearch } from './web-search';

describe('WebSearch', () => {
  let component: WebSearch;
  let fixture: ComponentFixture<WebSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(WebSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
