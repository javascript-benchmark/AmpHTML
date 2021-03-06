import {AccessController} from '../iframe-api/access-controller';
import {AmpAccessIframeApi} from '../iframe-api/iframe-api';

describes.fakeWin(
  'AmpAccessIframeApi',
  {
    amp: true,
    location: 'https://pub.com/doc1',
  },
  (env) => {
    let win;
    let iframeApi;
    let controllerMock;
    let messengerMock;

    beforeEach(() => {
      win = env.win;
      const controller = new AccessController();
      controllerMock = env.sandbox.mock(controller);
      iframeApi = new AmpAccessIframeApi(controller, win);
      messengerMock = env.sandbox.mock(iframeApi.messenger_);
    });

    afterEach(() => {
      controllerMock.verify();
      messengerMock.verify();
    });

    it('should configure messenger', () => {
      expect(iframeApi.messenger_.win_).to.equal(win);
      expect(iframeApi.messenger_.targetOrCallback_).to.equal(win.parent);
    });

    it('should connect and initialize', () => {
      const config = {'property': 'A'};
      messengerMock.expects('connect').once();
      messengerMock.expects('sendCommand').withExactArgs('connect').once();
      messengerMock.expects('getTargetOrigin').returns('TARGET_ORIGIN').once();
      controllerMock
        .expects('connect')
        .withExactArgs('TARGET_ORIGIN', 'protocol1', config)
        .returns(Promise.resolve(1))
        .once();
      const promise = iframeApi.connect();
      iframeApi.handleCommand_('start', {
        'protocol': 'protocol1',
        'config': config,
      });
      return expect(promise).to.eventually.equal(1);
    });

    it('should authorize', () => {
      controllerMock
        .expects('authorize')
        .withExactArgs()
        .returns(Promise.resolve({a: 1}))
        .once();
      return iframeApi.handleCommand_('authorize', {}).then((result) => {
        expect(result).to.deep.equal({a: 1});
      });
    });

    it('should pingback', () => {
      controllerMock
        .expects('pingback')
        .withExactArgs()
        .returns(Promise.resolve())
        .once();
      return iframeApi.handleCommand_('pingback', {});
    });

    it('should tolerate pingback without response', () => {
      controllerMock
        .expects('pingback')
        .withExactArgs()
        .returns(undefined)
        .once();
      return iframeApi.handleCommand_('pingback', {});
    });

    it('should ignore unimplemented pingback', () => {
      iframeApi = new AmpAccessIframeApi({}, win);
      return iframeApi.handleCommand_('pingback', {});
    });
  }
);
