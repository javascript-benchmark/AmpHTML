import * as Preact from '#preact';
import {Wrapper, useRenderer} from '#preact/component';
import {forwardRef} from '#preact/compat';
import {useCallback, useEffect, useImperativeHandle, useState} from '#preact';
import {useResourcesNotify} from '#preact/utils';

/**
 * @param {!JsonObject} data
 * @return {string}
 */
const DEFAULT_RENDER = (data) => JSON.stringify(data);

/**
 * @param {string} url
 * @return {!Promise<!JsonObject>}
 */
const DEFAULT_GET_JSON = (url) => {
  return fetch(url).then((res) => res.json());
};

/**
 * @param {!RenderDef.Props} props
 * @param {{current: ?RenderDef.RenderApi}} ref
 * @return {PreactDef.Renderable}
 */
export function RenderWithRef(
  {
    src = '',
    getJson = DEFAULT_GET_JSON,
    render = DEFAULT_RENDER,
    ariaLiveValue = 'polite',
    onLoading,
    onReady,
    onRefresh,
    onError,
    ...rest
  },
  ref
) {
  useResourcesNotify();

  const [data, setData] = useState({});

  useEffect(() => {
    // TODO(dmanek): Add additional validation for src
    // when adding url replacement logic.
    if (!src) {
      return;
    }
    let cancelled = false;
    onLoading?.();
    getJson(src)
      .then((data) => {
        if (!cancelled) {
          setData(data);
        }
      })
      .catch((e) => {
        onError?.(e);
      });
    return () => {
      cancelled = true;
    };
  }, [getJson, src, onError, onLoading]);

  const refresh = useCallback(() => {
    onRefresh?.();
    getJson(src, /* shouldRefresh */ true)
      .then((data) => {
        setData(data);
        onReady?.();
      })
      .catch((e) => {
        onError?.(e);
      });
  }, [getJson, src, onReady, onRefresh, onError]);

  useImperativeHandle(
    ref,
    () =>
      /** @type {!RenderDef.RenderApi} */ ({
        refresh,
      }),
    [refresh]
  );

  const rendered = useRenderer(render, data);
  const isHtml =
    rendered && typeof rendered == 'object' && '__html' in rendered;

  const refFn = useCallback(
    (node) => {
      if (!node?.firstElementChild || !rendered) {
        return;
      }
      onReady?.();
    },
    [rendered, onReady]
  );

  return (
    <Wrapper
      ref={refFn}
      {...rest}
      dangerouslySetInnerHTML={isHtml ? rendered : null}
      aria-live={ariaLiveValue}
    >
      {isHtml ? null : rendered}
    </Wrapper>
  );
}

const Render = forwardRef(RenderWithRef);
Render.displayName = 'Render';
export {Render};
