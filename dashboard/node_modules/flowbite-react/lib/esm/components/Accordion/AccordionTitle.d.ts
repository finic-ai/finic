import type { ComponentProps, FC } from 'react';
import type { FlowbiteHeadingLevel } from '../Flowbite/FlowbiteTheme';
export interface AccordionTitleProps extends ComponentProps<'button'> {
    arrowIcon?: FC<ComponentProps<'svg'>>;
    as?: FlowbiteHeadingLevel;
}
export declare const AccordionTitle: FC<AccordionTitleProps>;
