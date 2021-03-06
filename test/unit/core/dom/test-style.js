import * as st from '#core/dom/style';

describes.sandboxed('DOM - style helpers', {}, (env) => {
  it('toggle', () => {
    const element = document.createElement('div');

    st.toggle(element, true);
    expect(element).to.not.have.attribute('hidden');
    st.toggle(element, false);
    expect(element).to.have.attribute('hidden');
    st.toggle(element, true);
    expect(element).to.not.have.attribute('hidden');

    st.toggle(element);
    expect(element).to.have.attribute('hidden');
    st.toggle(element);
    expect(element).to.not.have.attribute('hidden');
  });

  it('setStyle', () => {
    const element = document.createElement('div');
    st.setStyle(element, 'width', '1px');
    expect(element.style.width).to.equal('1px');
  });

  it('setStyle with vendor prefix', () => {
    const element = {style: {WebkitTransitionDuration: ''}};
    st.setStyle(element, 'transitionDuration', '1s', undefined, true);
    expect(element.style.WebkitTransitionDuration).to.equal('1s');
  });

  it('setStyle with custom var', () => {
    const element = document.createElement('div');
    st.setStyle(element, '--x', '1px');
    expect(element.style.getPropertyValue('--x')).to.equal('1px');
    expect(st.getStyle(element, '--x')).to.equal('1px');
  });

  it('setStyles', () => {
    const element = document.createElement('div');
    st.setStyles(element, {
      width: st.px(101),
      height: st.px(102),
    });
    expect(element.style.width).to.equal('101px');
    expect(element.style.height).to.equal('102px');
  });

  it('setImportantStyles', () => {
    const element = document.createElement('div');
    st.setImportantStyles(element, {
      width: st.px(101),
    });
    expect(element.style.width).to.equal('101px');
    expect(element.style.getPropertyPriority('width')).to.equal('important');
  });

  it('setImportantStyles with vendor prefix', () => {
    const spy = env.sandbox.spy();
    const element = {
      style: {
        WebkitTransitionDurationImportant: '',
        setProperty: spy,
      },
    };
    st.setImportantStyles(element, {
      transitionDurationImportant: '1s',
    });
    expect(spy).to.have.been.calledWith(
      'WebkitTransitionDurationImportant',
      '1s',
      'important'
    );
  });

  it('px', () => {
    expect(st.px(0)).to.equal('0px');
    expect(st.px(101)).to.equal('101px');
  });

  it('translateX', () => {
    expect(st.translateX(101)).to.equal('translateX(101px)');
    expect(st.translateX('101vw')).to.equal('translateX(101vw)');
  });

  it('translate', () => {
    expect(st.translate(101, 201)).to.equal('translate(101px, 201px)');
    expect(st.translate('101vw, 201em')).to.equal('translate(101vw, 201em)');
    expect(st.translate(101)).to.equal('translate(101px)');
    expect(st.translate('101vw')).to.equal('translate(101vw)');
  });

  it('camelCaseToTitleCase', () => {
    const str = 'theQuickBrownFox';
    expect(st.camelCaseToTitleCase(str)).to.equal('TheQuickBrownFox');
  });

  it('removeAlphaFromColor', () => {
    expect(st.removeAlphaFromColor('rgba(1, 1, 1, 0)')).to.equal(
      'rgba(1, 1, 1, 1)'
    );
    expect(st.removeAlphaFromColor('rgb(1, 1, 1)')).to.equal('rgb(1, 1, 1)');
    expect(st.removeAlphaFromColor('rgba(0, 0, 0,-0.5)')).to.equal(
      'rgba(0, 0, 0, 1)'
    );
  });

  describe('getVendorJsPropertyName', () => {
    it('no prefix', () => {
      const element = {style: {transitionDuration: ''}};
      const prop = st.getVendorJsPropertyName(
        element.style,
        'transitionDuration',
        true
      );
      expect(prop).to.equal('transitionDuration');
    });

    it('should use cached previous result', () => {
      let element = {style: {transitionDuration: ''}};
      let prop = st.getVendorJsPropertyName(
        element.style,
        'transitionDuration'
      );
      expect(prop).to.equal('transitionDuration');

      element = {style: {WebkitTransitionDuration: ''}};
      prop = st.getVendorJsPropertyName(element.style, 'transitionDuration');
      expect(prop).to.equal('transitionDuration');
    });

    it('Webkit', () => {
      const element = {style: {WebkitTransitionDuration: ''}};
      const prop = st.getVendorJsPropertyName(
        element.style,
        'transitionDuration',
        true
      );
      expect(prop).to.equal('WebkitTransitionDuration');
    });

    it('Moz', () => {
      const element = {style: {MozTransitionDuration: ''}};
      const prop = st.getVendorJsPropertyName(
        element.style,
        'transitionDuration',
        true
      );
      expect(prop).to.equal('MozTransitionDuration');
    });

    it('ms', () => {
      const element = {style: {msTransitionDuration: ''}};
      const prop = st.getVendorJsPropertyName(
        element.style,
        'transitionDuration',
        true
      );
      expect(prop).to.equal('msTransitionDuration');
    });

    it('O opera', () => {
      const element = {style: {OTransitionDuration: ''}};
      const prop = st.getVendorJsPropertyName(
        element.style,
        'transitionDuration',
        true
      );
      expect(prop).to.equal('OTransitionDuration');
    });
  });
});
