/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CodeSwitcherComponent } from './code-switcher.component';

describe('CodeSwitcherComponent', () => {
  let component: CodeSwitcherComponent;
  let fixture: ComponentFixture<CodeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
