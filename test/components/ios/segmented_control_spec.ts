import {async, inject, addProviders} from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {Component, ViewChild} from '@angular/core';
import {ReactNativeRootRenderer} from '../../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {SegmentedControl} from "../../../src/components/ios/segmented_control";
import {fireFunctionalEvent, getTestingProviders} from "../../../src/test_helpers/utils";

describe('SegmentedControl component (iOS)', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => {
    mock.reset();
    addProviders(getTestingProviders(mock, TestComponent));
  });

  it('should render', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<SegmentedControl></SegmentedControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-segmentedcontrol+{"onChange":true,"height":28},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should render with properties', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<SegmentedControl [accessible]="true" testID="foo" [values]="['a','b']"></SegmentedControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-segmentedcontrol+{"onChange":true,"values":["a","b"],"accessible":true,"testID":"foo","height":28},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should render with styles', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<SegmentedControl [styleSheet]="20" [style]="{margin: 42}"></SegmentedControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-segmentedcontrol+{"onChange":true,"height":28,"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  })));

  it('should fire change event', async(inject([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    tcb.overrideTemplate(TestComponent, `<SegmentedControl (change)="handleChange($event)"></SegmentedControl>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture<TestComponent>) => {
        fixture.autoDetectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[0].children[0];
        fireFunctionalEvent('topChange', target, {selectedSegmentIndex: 0, value: 'a'});

        fixture.whenStable().then(() => {
          expect(fixture.componentInstance.log.join(',')).toEqual('0');
        });

      });
  })));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [SegmentedControl]
})
class TestComponent {
  @ViewChild(SegmentedControl) segmentedControl: SegmentedControl;
  log: Array<boolean> = [];

  handleChange(event: any) {
    this.log.push(event.selectedIndex);
  }
}