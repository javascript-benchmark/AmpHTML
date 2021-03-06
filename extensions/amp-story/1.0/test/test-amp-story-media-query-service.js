import {AmpStoryMediaQueryService} from '../amp-story-media-query-service';
import {poll} from '#testing/iframe';
import {afterRenderPromise} from '#testing/helpers';

describes.realWin('amp-story-media-query-service', {amp: true}, (env) => {
  let mediaQueryService;
  let storyEl;
  let styleEl;
  let win;

  function setMatcherSize(width, height) {
    styleEl.textContent = `
        .i-amphtml-story-media-query-matcher {
          position: absolute;
          height: ${height}px;
          width: ${width}px;
          border: none;
        }`;
  }

  function waitForClassName(element, className) {
    return poll(
      `className ${className} on ${element.tagName}`,
      () => {
        return element.classList.contains(className);
      },
      undefined /** opt_onError */,
      300 /** opt_timeout */
    );
  }

  beforeEach(async () => {
    win = env.win;

    storyEl = win.document.createElement('amp-story');
    storyEl.setAttribute('foo', 'bar');
    win.document.body.appendChild(storyEl);

    styleEl = win.document.createElement('style');
    setMatcherSize(200, 100);
    storyEl.appendChild(styleEl);

    await afterRenderPromise();
    mediaQueryService = new AmpStoryMediaQueryService(win);
  });

  afterEach(() => {
    storyEl.remove();
    mediaQueryService.matcher_.remove();
  });

  it('should add the attribute if the media query matches', async () => {
    const spy = env.sandbox.spy();
    await mediaQueryService.onMediaQueryMatch('(orientation: landscape)', spy);
    expect(spy).to.have.been.calledOnceWith(true);
  });

  it('should not add the attribute if the media query does not match', async () => {
    const spy = env.sandbox.spy();
    await mediaQueryService.onMediaQueryMatch('(orientation: portrait)', spy);
    expect(spy).to.have.been.calledOnceWith(false);
  });

  it('should handle multiple media queries', async () => {
    const spy1 = env.sandbox.spy();
    const p1 = mediaQueryService.onMediaQueryMatch(
      '(orientation: landscape)',
      spy1
    );
    const spy2 = env.sandbox.spy();
    const p2 = mediaQueryService.onMediaQueryMatch('(min-width: 600px)', spy2);
    await Promise.all([p1, p2]);
    expect(spy1).to.have.been.calledOnceWith(true);
    expect(spy2).to.have.been.calledOnceWith(false);
  });

  it('should add the className if the media query matches on resize', async () => {
    await mediaQueryService.onMediaQueryMatch(
      '(orientation: portrait)',
      (matches) => {
        storyEl.classList.toggle('portrait', matches);
      }
    );
    setMatcherSize(100, 300);
    return waitForClassName(storyEl, 'portrait');
  });
});
