import * as Preact from '#preact';
import {BaseCarousel} from '../../../amp-base-carousel/1.0/component';
import {InlineGallery} from '../component';
import {Pagination} from '../pagination';
import {Thumbnails} from '../thumbnails';
import {mount} from 'enzyme';

describes.sandboxed('InlineGallery preact component', {}, () => {
  describe('Pagination component', () => {
    it('should render BaseCarousel and Pagination', () => {
      const jsx = (
        <InlineGallery>
          <BaseCarousel>
            <div>slide 1</div>
            <div>slide 2</div>
            <div>slide 3</div>
          </BaseCarousel>
          <Pagination />
        </InlineGallery>
      );
      const wrapper = mount(jsx);
      const carousel = wrapper.find('BaseCarousel');
      expect(carousel).to.have.lengthOf(1);
      const slides = carousel.find('[data-slide]');
      expect(slides).to.have.lengthOf(3);

      const pagination = wrapper.find('Pagination');
      expect(pagination).to.have.lengthOf(1);
    });
  });

  describe('Thumbnail component', () => {
    it('should render BaseCarousel and Thumbnails', () => {
      const jsx = (
        <InlineGallery>
          <BaseCarousel>
            <div>slide 1</div>
            <div>slide 2</div>
            <div>slide 3</div>
          </BaseCarousel>
          <Thumbnails />
        </InlineGallery>
      );
      const wrapper = mount(jsx);

      const carousels = wrapper.find('BaseCarousel');
      expect(carousels).to.have.lengthOf(2);
      const slides = carousels.first().find('[data-slide]');
      expect(slides).to.have.lengthOf(3);

      const thumbnails = wrapper.find('Thumbnails');
      expect(thumbnails).to.have.lengthOf(1);
      const generatedCarousel = thumbnails.find('BaseCarousel');
      expect(generatedCarousel).to.have.lengthOf(1);
      expect(generatedCarousel.prop('loop')).to.be.false;
      expect(generatedCarousel.prop('snapAlign')).to.equal('start');
      expect(generatedCarousel.prop('outsetArrows')).to.be.true;

      const generatedSlides = generatedCarousel.find('[data-slide]');
      expect(generatedSlides).to.have.lengthOf(3);

      // By default there is no `src`
      expect(generatedSlides.at(0).find('img').prop('src')).to.be.undefined;
      expect(generatedSlides.at(1).find('img').prop('src')).to.be.undefined;
      expect(generatedSlides.at(2).find('img').prop('src')).to.be.undefined;
    });

    it('should respect thumbnailSrc', () => {
      const jsx = (
        <InlineGallery>
          <BaseCarousel>
            <div thumbnailSrc="slide1.jpg">slide 1</div>
            <div thumbnailSrc="slide2.jpg">slide 2</div>
            <div thumbnailSrc="slide3.jpg">slide 3</div>
          </BaseCarousel>
          <Thumbnails />
        </InlineGallery>
      );
      const wrapper = mount(jsx);

      const carousels = wrapper.find('BaseCarousel');
      expect(carousels).to.have.lengthOf(2);
      const slides = carousels.first().find('[data-slide]');
      expect(slides).to.have.lengthOf(3);

      const thumbnails = wrapper.find('Thumbnails');
      expect(thumbnails).to.have.lengthOf(1);
      const generatedCarousel = thumbnails.find('BaseCarousel');
      expect(generatedCarousel).to.have.lengthOf(1);
      expect(generatedCarousel.prop('loop')).to.be.false;
      expect(generatedCarousel.prop('snapAlign')).to.equal('start');
      expect(generatedCarousel.prop('outsetArrows')).to.be.true;

      const generatedSlides = generatedCarousel.find('[data-slide]');
      expect(generatedSlides).to.have.lengthOf(3);

      // Take from `thumbnailSrc` prop.
      expect(generatedSlides.at(0).find('img').prop('src')).to.equal(
        'slide1.jpg'
      );
      expect(generatedSlides.at(1).find('img').prop('src')).to.equal(
        'slide2.jpg'
      );
      expect(generatedSlides.at(2).find('img').prop('src')).to.equal(
        'slide3.jpg'
      );
    });

    it('should respect looping with slide alignment', () => {
      const jsx = (
        <InlineGallery>
          <BaseCarousel>
            <div>slide 1</div>
            <div>slide 2</div>
            <div>slide 3</div>
          </BaseCarousel>
          <Thumbnails loop />
        </InlineGallery>
      );
      const wrapper = mount(jsx);

      const carousels = wrapper.find('BaseCarousel');
      expect(carousels).to.have.lengthOf(2);
      const slides = carousels.first().find('[data-slide]');
      expect(slides).to.have.lengthOf(3);

      const thumbnails = wrapper.find('Thumbnails');
      expect(thumbnails).to.have.lengthOf(1);
      const generatedCarousel = thumbnails.find('BaseCarousel');
      expect(generatedCarousel).to.have.lengthOf(1);
      expect(generatedCarousel.prop('loop')).to.be.true;
      expect(generatedCarousel.prop('snapAlign')).to.equal('center');
      expect(generatedCarousel.prop('outsetArrows')).to.be.true;
    });
  });
});
