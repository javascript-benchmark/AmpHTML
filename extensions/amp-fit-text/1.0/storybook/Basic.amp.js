import * as Preact from '#preact';
import {number, text, withKnobs} from '@storybook/addon-knobs';
import {withAmp} from '@ampproject/storybook-addon';

export default {
  title: 'amp-fit-text-1_0',
  decorators: [withKnobs, withAmp],

  parameters: {
    extensions: [{name: 'amp-fit-text', version: '1.0'}],
    experiments: ['bento'],
  },
};

export const ScaleUpToCover = () => {
  return (
    <amp-fit-text
      width="300"
      height="200"
      style="border: 1px solid black;
      display: block;"
    >
      Lorem <i>ips</i>um dolor sit amet, has nisl nihil convenire et, vim at
      aeque inermis reprehendunt.
    </amp-fit-text>
  );
};

ScaleUpToCover.storyName = 'Scale up to cover';

export const ScaleUpOverflowEllipsis = () => {
  const minFontSize = number('minFontSize', 42);
  const content = text(
    'content',
    `
        Lorem <i>ips</i>um dolor sit amet, has nisl nihil convenire et, vim at
        aeque inermis reprehendunt.
      `
  );
  return (
    <amp-fit-text
      width="300"
      height="200"
      min-font-size={minFontSize}
      style="border: 1px solid black;
      display: block;"
      dangerouslySetInnerHTML={{__html: content}}
    />
  );
};

ScaleUpOverflowEllipsis.storyName = 'Scale up + overflow + ellipsis';

export const ScaleDown = () => {
  return (
    <amp-fit-text
      width="300"
      height="200"
      style="border: 1px solid black;
      display: block;"
    >
      Lorem <i>ips</i>um dolor sit amet, has nisl nihil convenire et, vim at
      aeque inermis reprehendunt. Propriae tincidunt id nec, elit nusquam te
      mea, ius noster platonem in. Mea an idque minim, sit sale deleniti
      apeirian et. Omnium legendos tractatos cu mea. Vix in stet dolorem
      accusamus. Iisque rationibus consetetur in cum, quo unum nulla legere ut.
      Simul numquam saperet no sit.
    </amp-fit-text>
  );
};

ScaleDown.storyName = 'Scale down';

export const ScaleDownMore = () => {
  return (
    <amp-fit-text
      width="108"
      height="78"
      style="border: 1px solid black;
      display: block;"
    >
      Superlongword text
    </amp-fit-text>
  );
};

ScaleDownMore.storyName = 'Scale down more';

export const LayoutResponsive = () => {
  return (
    <div
      style="background-color: #bebebe;
      width: 40vw;"
    >
      <amp-fit-text
        width="100"
        height="100"
        style="border: 1px solid black;"
        layout="responsive"
        max-font-size="200"
      >
        Lorem <i>ips</i>um dolor sit amet, has nisl nihil convenire et, vim at
        aeque inermis reprehendunt.
      </amp-fit-text>
    </div>
  );
};

LayoutResponsive.storyName = 'layout=responsive';
