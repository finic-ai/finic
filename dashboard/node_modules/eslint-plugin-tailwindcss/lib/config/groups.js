/**
 * @fileoverview Default groups for Tailwind CSS classnames
 * @description The hierarchy of `members` can be useful to detect redundant and/or contradicting classnames
 * @version v3.1.3
 * @see https://tailwindcss.com/docs
 * @author François Massart
 */
module.exports.groups = [
  {
    type: 'Core Concepts',
    members: [
      {
        type: 'Hover, Focus, & Other States',
        members: [
          {
            type: 'group',
            members: 'group',
          },
          {
            type: 'peer',
            members: 'peer',
          },
        ],
      },
      {
        type: 'Dark Mode',
        members: '${dark}',
      },
      {
        type: 'Arbitrary properties',
        members: '${arbitraryProperties}',
      },
    ],
  },
  {
    type: 'Layout',
    members: [
      {
        type: 'Aspect Ratio',
        members: 'aspect\\-(?<value>${aspectRatio})',
      },
      {
        type: 'Container',
        members: 'container',
      },
      {
        type: 'Columns',
        members: 'columns\\-(?<value>${columns})',
      },
      {
        type: 'Break After',
        members: 'break\\-after\\-(?<value>auto|avoid|all|avoid\\-page|page|left|right|column)',
      },
      {
        type: 'Break Before',
        members: 'break\\-before\\-(?<value>auto|avoid|all|avoid\\-page|page|left|right|column)',
      },
      {
        type: 'Break Inside',
        members: 'break\\-inside\\-(?<value>auto|avoid|avoid\\-page|avoid\\-column)',
      },
      {
        type: 'Box Decoration Break',
        members: 'box\\-decoration\\-(?<value>clone|slice)',
      },
      {
        type: 'Deprecated Box Decoration Break',
        members: 'decoration\\-(?<value>clone|slice)',
        deprecated: true,
      },
      {
        type: 'Box Sizing',
        members: 'box\\-(?<value>border|content)',
      },
      {
        type: 'Display',
        members:
          'block|flex|grid|flow\\-root|contents|hidden|inline(\\-(block|flex|table|grid))?|table\\-(column|footer|header|row)\\-group|table(\\-(caption|row|cell|column))?|list\\-item',
      },
      {
        type: 'Floats',
        members: 'float\\-(?<value>right|left|none)',
      },
      {
        type: 'Clear',
        members: 'clear\\-(?<value>left|right|both|none)',
      },
      {
        type: 'Isolation',
        members: '(isolate|isolation\\-auto)',
      },
      {
        type: 'Object Fit',
        members: 'object\\-(?<value>contain|cover|fill|none|scale\\-down)',
      },
      {
        type: 'Object Position',
        members: 'object\\-(?<value>${objectPosition})',
      },
      {
        type: 'Overflow',
        members: [
          {
            type: 'overflow',
            members: 'overflow\\-(?<value>auto|hidden|clip|visible|scroll)',
            shorthand: 'all',
            body: 'overflow',
          },
          {
            type: 'overflow-x',
            members: 'overflow\\-x\\-(?<value>auto|hidden|clip|visible|scroll)',
            shorthand: 'x',
            body: 'overflow-x',
          },
          {
            type: 'overflow-y',
            members: 'overflow\\-y\\-(?<value>auto|hidden|clip|visible|scroll)',
            shorthand: 'y',
            body: 'overflow-y',
          },
        ],
      },
      {
        type: 'Overscroll Behavior',
        members: [
          {
            type: 'overscroll',
            members: 'overscroll\\-(?<value>auto|contain|none)',
            shorthand: 'all',
            body: 'overscroll',
          },
          {
            type: 'overscroll-x',
            members: 'overscroll\\-x\\-(?<value>auto|contain|none)',
            shorthand: 'x',
            body: 'overscroll-x',
          },
          {
            type: 'overscroll-y',
            members: 'overscroll\\-y\\-(?<value>auto|contain|none)',
            shorthand: 'y',
            body: 'overscroll-y',
          },
        ],
      },
      {
        type: 'Position',
        members: 'static|fixed|absolute|relative|sticky',
      },
      {
        type: 'Top / Right / Bottom / Left',
        members: [
          {
            type: 'inset',
            members: '(inset\\-(?<value>${inset})|\\-inset\\-(?<negativeValue>${-inset}))',
            shorthand: 'all',
            body: 'inset',
          },
          {
            type: 'inset-y',
            members: '(inset\\-y\\-(?<value>${inset})|\\-inset\\-y\\-(?<negativeValue>${-inset}))',
            shorthand: 'y',
            body: 'inset-y',
          },
          {
            type: 'inset-x',
            members: '(inset\\-x\\-(?<value>${inset})|\\-inset\\-x\\-(?<negativeValue>${-inset}))',
            shorthand: 'x',
            body: 'inset-x',
          },
          {
            type: 'top',
            members: '(top\\-(?<value>${inset})|\\-top\\-(?<negativeValue>${-inset}))',
            shorthand: 't',
            body: 'top',
          },
          {
            type: 'right',
            members: '(right\\-(?<value>${inset})|\\-right\\-(?<negativeValue>${-inset}))',
            shorthand: 'r',
            body: 'right',
          },
          {
            type: 'bottom',
            members: '(bottom\\-(?<value>${inset})|\\-bottom\\-(?<negativeValue>${-inset}))',
            shorthand: 'b',
            body: 'bottom',
          },
          {
            type: 'left',
            members: '(left\\-(?<value>${inset})|\\-left\\-(?<negativeValue>${-inset}))',
            shorthand: 'l',
            body: 'left',
          },
        ],
      },
      {
        type: 'Visibility',
        members: '(in)?visible|collapse',
      },
      {
        type: 'Z-Index',
        members: '(z\\-(?<value>${zIndex})|\\-z\\-(?<negativeValue>${-zIndex}))',
      },
    ],
  },
  {
    type: 'Flexbox & Grid',
    members: [
      {
        type: 'Flex Basis',
        members: 'basis\\-(?<value>${flexBasis})',
      },
      {
        type: 'Flex Direction',
        members: 'flex\\-(row|col)(\\-reverse)?',
      },
      {
        type: 'Flex Wrap',
        members: 'flex\\-(wrap(\\-reverse)?|nowrap)',
      },
      {
        type: 'Flex',
        members: 'flex\\-(?<value>${flex})',
      },
      {
        type: 'Flex Grow',
        members: 'grow(\\-(?<value>${flexGrow}))?',
      },
      {
        type: 'Deprecated Flex Grow',
        members: 'flex\\-grow(\\-(?<value>${flexGrow}))?',
        deprecated: true,
      },
      {
        type: 'Flex Shrink',
        members: 'shrink(\\-(?<value>${flexShrink}))?',
      },
      {
        type: 'Deprecated Flex Shrink',
        members: 'flex\\-shrink(\\-(?<value>${flexShrink}))?',
        deprecated: true,
      },
      {
        type: 'Order',
        members: '(order\\-(?<value>${order})|\\-order\\-(?<negativeValue>${-order}))',
      },
      {
        type: 'Grid Template Columns',
        members: 'grid\\-cols\\-(?<value>${gridTemplateColumns})',
      },
      {
        type: 'Grid Column Start / End',
        members: [
          {
            type: 'grid-column',
            members: 'col\\-(?<value>${gridColumn})',
          },
          {
            type: 'grid-column-start',
            members: 'col\\-start\\-(?<value>${gridColumnStart})',
          },
          {
            type: 'grid-column-end',
            members: 'col\\-end\\-(?<value>${gridColumnEnd})',
          },
        ],
      },
      {
        type: 'Grid Template Rows',
        members: 'grid\\-rows\\-(?<value>${gridTemplateRows})',
      },
      {
        type: 'Grid Row Start / End',
        members: [
          {
            type: 'grid-row',
            members: 'row\\-(?<value>${gridRow})',
          },
          {
            type: 'grid-row-start',
            members: 'row\\-start\\-(?<value>${gridRowStart})',
          },
          {
            type: 'grid-row-end',
            members: 'row\\-end\\-(?<value>${gridRowEnd})',
          },
        ],
      },
      {
        type: 'Grid Auto Flow',
        members: 'grid\\-flow\\-(dense|(row|col)(\\-dense)?)',
      },
      {
        type: 'Grid Auto Columns',
        members: 'auto\\-cols\\-(?<value>${gridAutoColumns})',
      },
      {
        type: 'Grid Auto Rows',
        members: 'auto\\-rows\\-(?<value>${gridAutoRows})',
      },
      {
        type: 'Gap',
        members: [
          {
            type: 'gap',
            members: 'gap\\-(?<value>${gap})',
            shorthand: 'all',
            body: 'gap',
          },
          {
            type: 'column-gap',
            members: 'gap\\-x\\-(?<value>${gap})',
            shorthand: 'x',
            body: 'gap-x',
          },
          {
            type: 'row-gap',
            members: 'gap\\-y\\-(?<value>${gap})',
            shorthand: 'y',
            body: 'gap-y',
          },
        ],
      },
      {
        type: 'Justify Content',
        members: 'justify\\-(start|end|center|between|around|evenly)',
      },
      {
        type: 'Justify Items',
        members: 'justify\\-items\\-(start|end|center|stretch)',
      },
      {
        type: 'Justify Self',
        members: 'justify\\-self\\-(auto|start|end|center|stretch)',
      },
      {
        type: 'Align Content',
        members: 'content\\-(center|start|end|between|around|evenly|baseline)',
      },
      {
        type: 'Align Items',
        members: 'items\\-(start|end|center|baseline|stretch)',
      },
      {
        type: 'Align Self',
        members: 'self\\-(auto|start|end|center|stretch|baseline)',
      },
      {
        type: 'Place Content',
        members: 'place\\-content\\-(center|start|end|between|around|evenly|stretch|baseline)',
      },
      {
        type: 'Place Items',
        members: 'place\\-items\\-(start|end|center|stretch|baseline)',
      },
      {
        type: 'Place Self',
        members: 'place\\-self\\-(auto|start|end|center|stretch)',
      },
    ],
  },
  {
    type: 'Spacing',
    members: [
      {
        type: 'Padding',
        members: [
          {
            type: 'p',
            members: 'p\\-(?<value>${padding})',
            shorthand: 'all',
            body: 'p',
          },
          {
            type: 'py',
            members: 'py\\-(?<value>${padding})',
            shorthand: 'y',
            body: 'py',
          },
          {
            type: 'px',
            members: 'px\\-(?<value>${padding})',
            shorthand: 'x',
            body: 'px',
          },
          {
            type: 'pt',
            members: 'pt\\-(?<value>${padding})',
            shorthand: 't',
            body: 'pt',
          },
          {
            type: 'pr',
            members: 'pr\\-(?<value>${padding})',
            shorthand: 'r',
            body: 'pr',
          },
          {
            type: 'pb',
            members: 'pb\\-(?<value>${padding})',
            shorthand: 'b',
            body: 'pb',
          },
          {
            type: 'pl',
            members: 'pl\\-(?<value>${padding})',
            shorthand: 'l',
            body: 'pl',
          },
        ],
      },
      {
        type: 'Margin',
        members: [
          {
            type: 'm',
            members: '(m\\-(?<value>${margin})|\\-m\\-(?<negativeValue>${-margin}))',
            shorthand: 'all',
            body: 'm',
          },
          {
            type: 'my',
            members: '(my\\-(?<value>${margin})|\\-my\\-(?<negativeValue>${-margin}))',
            shorthand: 'y',
            body: 'my',
          },
          {
            type: 'mx',
            members: '(mx\\-(?<value>${margin})|\\-mx\\-(?<negativeValue>${-margin}))',
            shorthand: 'x',
            body: 'mx',
          },
          {
            type: 'mt',
            members: '(mt\\-(?<value>${margin})|\\-mt\\-(?<negativeValue>${-margin}))',
            shorthand: 't',
            body: 'mt',
          },
          {
            type: 'mr',
            members: '(mr\\-(?<value>${margin})|\\-mr\\-(?<negativeValue>${-margin}))',
            shorthand: 'r',
            body: 'mr',
          },
          {
            type: 'mb',
            members: '(mb\\-(?<value>${margin})|\\-mb\\-(?<negativeValue>${-margin}))',
            shorthand: 'b',
            body: 'mb',
          },
          {
            type: 'ml',
            members: '(ml\\-(?<value>${margin})|\\-ml\\-(?<negativeValue>${-margin}))',
            shorthand: 'l',
            body: 'ml',
          },
        ],
      },
      {
        type: 'Space Between',
        members: [
          {
            type: 'space-y',
            members: '(space\\-y\\-(?<value>${space})|\\-space\\-y\\-(?<negativeValue>${-space}))',
          },
          {
            type: 'space-x',
            members: '(space\\-x\\-(?<value>${space})|\\-space\\-x\\-(?<negativeValue>${-space}))',
          },
          {
            type: 'space-y-reverse',
            members: 'space\\-y\\-reverse',
          },
          {
            type: 'space-x-reverse',
            members: 'space\\-x\\-reverse',
          },
        ],
      },
    ],
  },
  {
    type: 'Sizing',
    members: [
      {
        type: 'Width',
        members: 'w\\-(?<value>${width})',
      },
      {
        type: 'Min-Width',
        members: 'min\\-w\\-(?<value>${minWidth})',
      },
      {
        type: 'Max-Width',
        members: 'max\\-w\\-(?<value>${maxWidth})',
      },
      {
        type: 'Height',
        members: 'h\\-(?<value>${height})',
      },
      {
        type: 'Min-Height',
        members: 'min\\-h\\-(?<value>${minHeight})',
      },
      {
        type: 'Max-Height',
        members: 'max\\-h\\-(?<value>${maxHeight})',
      },
    ],
  },
  {
    type: 'Typography',
    members: [
      {
        type: 'Font Family',
        members: 'font\\-(?<value>${fontFamily})',
      },
      {
        type: 'Font Size',
        members: 'text\\-(?<value>${fontSize})',
      },
      {
        type: 'Font Smoothing',
        members: '(subpixel\\-)?antialiased',
      },
      {
        type: 'Font Style',
        members: '(not\\-)?italic',
      },
      {
        type: 'Font Weight',
        members: 'font\\-(?<value>${fontWeight})',
      },
      {
        type: 'Font Variant Numeric',
        members:
          '(normal|lining|oldstyle|proportional|tabular)\\-nums|ordinal|slashed-zero|(diagonal|stacked)\\-fractions',
      },
      {
        type: 'Letter Spacing',
        members: '(tracking\\-(?<value>${letterSpacing})|\\-tracking\\-(?<negativeValue>${-letterSpacing}))',
      },
      {
        type: 'Line Height',
        members: 'leading\\-(?<value>${lineHeight})',
      },
      {
        type: 'List Style Type',
        members: 'list\\-(?<value>${listStyleType})',
      },
      {
        type: 'List Style Position',
        members: 'list\\-(in|out)side',
      },
      {
        type: 'Text Alignment',
        members: 'text\\-(left|center|right|justify|start|end)',
      },
      {
        type: 'Text Color',
        members: 'text\\-(?<value>${textColor})',
      },
      {
        type: 'Text Decoration',
        members: '(no\\-)?underline|overline|line\\-through',
      },
      {
        type: 'Text Decoration Color',
        members: 'decoration\\-(?<value>${textDecorationColor})',
      },
      {
        type: 'Text Decoration Style',
        members: 'decoration\\-(solid|double|dotted|dashed|wavy)',
      },
      {
        type: 'Text Decoration Thickness',
        members: 'decoration\\-(?<value>${textDecorationThickness})',
      },
      {
        type: 'Text Underline Offset',
        members: 'underline\\-offset\\-(?<value>${textUnderlineOffset})',
      },
      {
        type: 'Text Transform',
        members: '(upper|lower|normal\\-)case|capitalize',
      },
      {
        type: 'Text Overflow',
        members: 'truncate|text\\-(ellipsis|clip)',
      },
      {
        type: 'Deprecated Text Overflow',
        members: 'overflow\\-(ellipsis|clip)',
        deprecated: true,
      },
      {
        type: 'Text Indent',
        members: '(indent\\-(?<value>${textIndent})|\\-indent\\-(?<negativeValue>${-textIndent}))',
      },
      {
        type: 'Vertical Alignment',
        members: 'align\\-(baseline|top|middle|bottom|text\\-(top|bottom)|sub|super)',
      },
      {
        type: 'Whitespace',
        members: 'whitespace\\-(normal|nowrap|pre(\\-(line|wrap))?)',
      },
      {
        type: 'Word Break',
        members: 'break\\-(normal|words|all|keep)',
      },
      {
        type: 'Content',
        members: 'content\\-(?<value>${content})',
      },
    ],
  },
  {
    type: 'Backgrounds',
    members: [
      {
        type: 'Background Attachment',
        members: 'bg\\-(fixed|local|scroll)',
      },
      {
        type: 'Background Clip',
        members: 'bg\\-clip\\-(border|padding|content|text)',
      },
      {
        type: 'Background Color',
        members: 'bg\\-(?<value>${backgroundColor})',
      },
      {
        type: 'Deprecated Background Opacity',
        members: 'bg\\-opacity\\-(?<value>${backgroundOpacity})',
        deprecated: true,
      },
      {
        type: 'Background Origin',
        members: 'bg\\-origin\\-(border|padding|content)',
      },
      {
        type: 'Background Position',
        members: 'bg\\-(?<value>${backgroundPosition})',
      },
      {
        type: 'Background Repeat',
        members: 'bg\\-(no\\-repeat|repeat(\\-(x|y|round|space))?)',
      },
      {
        type: 'Background Size',
        members: 'bg\\-(?<value>${backgroundSize})',
      },
      {
        type: 'Background Image',
        members: 'bg\\-(?<value>${backgroundImage})',
      },
      {
        type: 'Gradient Color Stops',
        members: [
          {
            type: 'from',
            members: 'from\\-(?<value>${gradientColorStops})',
          },
          {
            type: 'via',
            members: 'via\\-(?<value>${gradientColorStops})',
          },
          {
            type: 'to',
            members: 'to\\-(?<value>${gradientColorStops})',
          },
        ],
      },
    ],
  },
  {
    type: 'Borders',
    members: [
      {
        type: 'Border Radius',
        members: [
          {
            type: 'border-radius',
            members: 'rounded(\\-(?<value>${borderRadius}))?',
            shorthand: 'all',
            body: 'rounded',
          },
          {
            type: 'border-radius-top',
            members: 'rounded\\-t(\\-(?<value>${borderRadius}))?',
            shorthand: 't',
            body: 'rounded-t',
          },
          {
            type: 'border-radius-right',
            members: 'rounded\\-r(\\-(?<value>${borderRadius}))?',
            shorthand: 'r',
            body: 'rounded-r',
          },
          {
            type: 'border-radius-bottom',
            members: 'rounded\\-b(\\-(?<value>${borderRadius}))?',
            shorthand: 'b',
            body: 'rounded-b',
          },
          {
            type: 'border-radius-left',
            members: 'rounded\\-l(\\-(?<value>${borderRadius}))?',
            shorthand: 'l',
            body: 'rounded-l',
          },
          {
            type: 'border-radius-top-left',
            members: 'rounded\\-tl(\\-(?<value>${borderRadius}))?',
            shorthand: 'tl',
            body: 'rounded-tl',
          },
          {
            type: 'border-radius-top-right',
            members: 'rounded\\-tr(\\-(?<value>${borderRadius}))?',
            shorthand: 'tr',
            body: 'rounded-tr',
          },
          {
            type: 'border-radius-bottom-right',
            members: 'rounded\\-br(\\-(?<value>${borderRadius}))?',
            shorthand: 'br',
            body: 'rounded-br',
          },
          {
            type: 'border-radius-bottom-left',
            members: 'rounded\\-bl(\\-(?<value>${borderRadius}))?',
            shorthand: 'bl',
            body: 'rounded-bl',
          },
        ],
      },
      {
        type: 'Border Width',
        members: [
          {
            type: 'border-width',
            members: 'border(\\-(?<value>${borderWidth}))?',
            shorthand: 'all',
            body: 'border',
          },
          {
            type: 'border-y-width',
            members: 'border\\-y(\\-(?<value>${borderWidth}))?',
            shorthand: 'y',
            body: 'border-y',
          },
          {
            type: 'border-x-width',
            members: 'border\\-x(\\-(?<value>${borderWidth}))?',
            shorthand: 'x',
            body: 'border-x',
          },
          {
            type: 'border-top-width',
            members: 'border\\-t(\\-(?<value>${borderWidth}))?',
            shorthand: 't',
            body: 'border-t',
          },
          {
            type: 'border-right-width',
            members: 'border\\-r(\\-(?<value>${borderWidth}))?',
            shorthand: 'r',
            body: 'border-r',
          },
          {
            type: 'border-bottom-width',
            members: 'border\\-b(\\-(?<value>${borderWidth}))?',
            shorthand: 'b',
            body: 'border-b',
          },
          {
            type: 'border-left-width',
            members: 'border\\-l(\\-(?<value>${borderWidth}))?',
            shorthand: 'l',
            body: 'border-l',
          },
        ],
      },
      {
        type: 'Border Color',
        members: [
          {
            type: 'border-color',
            members: 'border\\-(?<value>${borderColor})',
            shorthand: 'all',
            body: 'border',
          },
          {
            type: 'border-y-color',
            members: 'border\\-y\\-(?<value>${borderColor})',
            shorthand: 'y',
            body: 'border-y',
          },
          {
            type: 'border-x-color',
            members: 'border\\-x\\-(?<value>${borderColor})',
            shorthand: 'x',
            body: 'border-x',
          },
          {
            type: 'border-top-color',
            members: 'border\\-t\\-(?<value>${borderColor})',
            shorthand: 't',
            body: 'border-t',
          },
          {
            type: 'border-right-color',
            members: 'border\\-r\\-(?<value>${borderColor})',
            shorthand: 'r',
            body: 'border-r',
          },
          {
            type: 'border-bottom-color',
            members: 'border\\-b\\-(?<value>${borderColor})',
            shorthand: 'b',
            body: 'border-b',
          },
          {
            type: 'border-left-color',
            members: 'border\\-l\\-(?<value>${borderColor})',
            shorthand: 'l',
            body: 'border-l',
          },
        ],
      },
      {
        type: 'Deprecated Border Opacity',
        members: 'border\\-opacity\\-(?<value>${borderOpacity})',
        deprecated: true,
      },
      {
        type: 'Border Style',
        members: 'border\\-(solid|dashed|dotted|double|hidden|none)',
      },
      {
        type: 'Divide Width',
        members: [
          {
            type: 'divide-y',
            members: 'divide\\-y(\\-(?<value>${divideWidth}))?',
          },
          {
            type: 'divide-x',
            members: 'divide\\-x(\\-(?<value>${divideWidth}))?',
          },
          {
            type: 'divide-y-reverse',
            members: 'divide\\-y\\-reverse',
          },
          {
            type: 'divide-x-reverse',
            members: 'divide\\-x\\-reverse',
          },
        ],
      },
      {
        type: 'Divide Color',
        members: 'divide\\-(?<value>${divideColor})',
      },
      {
        type: 'Divide Style',
        members: 'divide\\-(solid|dashed|dotted|double|none)',
      },
      {
        type: 'Outline Width',
        members: 'outline\\-(?<value>${outlineWidth})',
      },
      {
        type: 'Outline Color',
        members: 'outline\\-(?<value>${outlineColor})',
      },
      {
        type: 'Outline Style',
        members: 'outline(\\-(none|dashed|dotted|double|hidden))?',
      },
      {
        type: 'Outline Offset',
        members:
          '(outline\\-offset\\-(?<value>${outlineOffset})|\\-outline\\-offset\\-(?<negativeValue>${-outlineOffset}))',
      },
      {
        type: 'Ring Width',
        members: [
          {
            type: 'ring',
            members: 'ring(\\-(?<value>${ringWidth}))?',
          },
        ],
      },
      {
        type: 'Ring Inset',
        members: [
          {
            type: 'ring-inset',
            members: 'ring\\-inset',
          },
        ],
      },
      {
        type: 'Ring Color',
        members: 'ring\\-(?<value>${ringColor})',
      },
      {
        type: 'Deprecated Ring Opacity',
        members: 'ring\\-opacity\\-(?<value>${ringOpacity})',
        deprecated: true,
      },
      {
        type: 'Ring Offset Width',
        members: 'ring\\-offset\\-(?<value>${ringOffsetWidth})',
      },
      {
        type: 'Ring Offset Color',
        members: 'ring\\-offset\\-(?<value>${ringOffsetColor})',
      },
    ],
  },
  {
    type: 'Effects',
    members: [
      {
        type: 'Box Shadow',
        members: 'shadow(\\-(?<value>${boxShadow}))?',
      },
      {
        type: 'Box Shadow Color',
        members: 'shadow(\\-(?<value>${boxShadowColor}))?',
      },
      {
        type: 'Opacity',
        members: 'opacity\\-(?<value>${opacity})',
      },
      {
        type: 'Mix Blend Mode',
        members:
          'mix\\-blend\\-(normal|multiply|screen|overlay|darken|lighten|color\\-(burn|dodge)|(hard|soft)\\-light|difference|exclusion|hue|saturation|color|luminosity|plus\\-lighter)',
      },
      {
        type: 'Background Blend Mode',
        members:
          'bg\\-blend\\-(normal|multiply|screen|overlay|darken|lighten|color\\-(dodge|burn)|(hard|soft)\\-light|difference|exclusion|hue|saturation|color|luminosity)',
      },
    ],
  },
  {
    type: 'Filters',
    members: [
      {
        type: 'Deprecated Filter',
        members: 'filter',
        deprecated: true,
      },
      {
        type: 'Blur',
        members: 'blur(\\-(?<value>${blur}))?',
      },
      {
        type: 'Brightness',
        members: 'brightness\\-(?<value>${brightness})',
      },
      {
        type: 'Contrast',
        members: 'contrast\\-(?<value>${contrast})',
      },
      {
        type: 'Drop Shadow',
        members: 'drop\\-shadow(\\-(?<value>${dropShadow}))?',
      },
      {
        type: 'Grayscale',
        members: 'grayscale(\\-(?<value>${grayscale}))?',
      },
      {
        type: 'Hue Rotate',
        members: 'hue\\-rotate\\-(?<value>${hueRotate})|\\-hue\\-rotate\\-(?<negativeValue>${-hueRotate})',
      },
      {
        type: 'Invert',
        members: 'invert(\\-(?<value>${invert}))?',
      },
      {
        type: 'Saturate',
        members: 'saturate\\-(?<value>${saturate})',
      },
      {
        type: 'Sepia',
        members: 'sepia(\\-(?<value>${sepia}))?',
      },
      {
        type: 'Backdrop Blur',
        members: 'backdrop\\-blur(\\-(?<value>${backdropBlur}))?',
      },
      {
        type: 'Backdrop Brightness',
        members: 'backdrop\\-brightness\\-(?<value>${backdropBrightness})',
      },
      {
        type: 'Backdrop Contrast',
        members: 'backdrop\\-contrast\\-(?<value>${backdropContrast})',
      },
      {
        type: 'Backdrop Grayscale',
        members: 'backdrop\\-grayscale(\\-(?<value>${backdropGrayscale}))?',
      },
      {
        type: 'Backdrop Hue Rotate',
        members:
          'backdrop\\-hue\\-rotate\\-(?<value>${backdropHueRotate})|\\-backdrop\\-hue\\-rotate\\-(?<negativeValue>${-backdropHueRotate})',
      },
      {
        type: 'Backdrop Invert',
        members: 'backdrop\\-invert(\\-(?<value>${backdropInvert}))?',
      },
      {
        type: 'Backdrop Opacity',
        members: 'backdrop\\-opacity\\-(?<value>${backdropOpacity})',
      },
      {
        type: 'Backdrop Saturate',
        members: 'backdrop\\-saturate\\-(?<value>${backdropSaturate})',
      },
      {
        type: 'Backdrop Sepia',
        members: 'backdrop\\-sepia(\\-(?<value>${backdropSepia}))?',
      },
    ],
  },
  {
    type: 'Tables',
    members: [
      {
        type: 'Border Collapse',
        members: 'border\\-(collapse|separate)',
      },
      {
        type: 'Border Spacing',
        members: [
          {
            type: 'border-spacing',
            members: 'border\\-spacing\\-(?<value>${borderSpacing})',
            shorthand: 'all',
            body: 'border-spacing',
          },
          {
            type: 'border-spacing-x',
            members: 'border\\-spacing\\-x\\-(?<value>${borderSpacing})',
            shorthand: 'x',
            body: 'border-spacing-x',
          },
          {
            type: 'border-spacing-y',
            members: 'border\\-spacing\\-y\\-(?<value>${borderSpacing})',
            shorthand: 'y',
            body: 'border-spacing-y',
          },
        ],
      },
      {
        type: 'Table Layout',
        members: 'table\\-(auto|fixed)',
      },
    ],
  },
  {
    type: 'Transitions & Animation',
    members: [
      {
        type: 'Transition Property',
        members: 'transition(\\-(?<value>${transitionProperty}))?',
      },
      {
        type: 'Transition Duration',
        members: 'duration(\\-(?<value>${transitionDuration}))?',
      },
      {
        type: 'Transition Timing Function',
        members: 'ease(\\-(?<value>${transitionTimingFunction}))?',
      },
      {
        type: 'Transition Delay',
        members: 'delay\\-(?<value>${transitionDelay})',
      },
      {
        type: 'Animation',
        members: 'animate\\-(?<value>${animation})',
      },
    ],
  },
  {
    type: 'Transforms',
    members: [
      {
        type: 'Transform GPU',
        members: [
          {
            type: 'transform-gpu',
            members: 'transform\\-gpu',
          },
        ],
      },
      {
        type: 'Transform None',
        members: [
          {
            type: 'transform-none',
            members: 'transform\\-none',
          },
        ],
      },
      {
        type: 'Deprecated Transform',
        members: [
          {
            type: 'transform',
            members: 'transform',
            deprecated: true,
          },
        ],
      },
      {
        type: 'Scale',
        members: [
          {
            type: 'scale',
            members: 'scale\\-(?<value>${scale})|\\-scale\\-(?<negativeValue>${-scale})',
            shorthand: 'all',
            body: 'scale',
          },
          {
            type: 'scale-y',
            members: 'scale\\-y\\-(?<value>${scale})|\\-scale\\-y\\-(?<negativeValue>${-scale})',
            shorthand: 'y',
            body: 'scale-y',
          },
          {
            type: 'scale-x',
            members: 'scale\\-x\\-(?<value>${scale})|\\-scale\\-x\\-(?<negativeValue>${-scale})',
            shorthand: 'x',
            body: 'scale-x',
          },
        ],
      },
      {
        type: 'Rotate',
        members: '(rotate\\-(?<value>${rotate})|\\-rotate\\-(?<negativeValue>${-rotate}))',
      },
      {
        type: 'Translate',
        members: [
          {
            type: 'translate-x',
            members: '(translate\\-x\\-(?<value>${translate})|\\-translate\\-x\\-(?<negativeValue>${-translate}))',
          },
          {
            type: 'translate-y',
            members: '(translate\\-y\\-(?<value>${translate})|\\-translate\\-y\\-(?<negativeValue>${-translate}))',
          },
        ],
      },
      {
        type: 'Skew',
        members: [
          {
            type: 'skew-x',
            members: '(skew\\-x\\-(?<value>${skew})|\\-skew\\-x\\-(?<negativeValue>${-skew}))',
          },
          {
            type: 'skew-y',
            members: '(skew\\-y\\-(?<value>${skew})|\\-skew\\-y\\-(?<negativeValue>${-skew}))',
          },
        ],
      },
      {
        type: 'Transform Origin',
        members: 'origin\\-(?<value>${transformOrigin})',
      },
    ],
  },
  {
    type: 'Interactivity',
    members: [
      {
        type: 'Accent Color',
        members: 'accent\\-(?<value>${accentColor})',
      },
      {
        type: 'Appearance',
        members: 'appearance\\-none',
      },
      {
        type: 'Cursor',
        members: 'cursor\\-(?<value>${cursor})',
      },
      {
        type: 'Caret Color',
        members: 'caret\\-(?<value>${caretColor})',
      },
      {
        type: 'Pointer Events',
        members: 'pointer\\-events\\-(none|auto)',
      },
      {
        type: 'Resize',
        members: 'resize(\\-(none|x|y))?',
      },
      {
        type: 'Scroll Behavior',
        members: 'scroll\\-(auto|smooth)',
      },
      {
        type: 'Scroll Margin',
        members: 'scroll\\-(?<value>${scrollMargin})',
        members: [
          {
            type: 'scroll-m',
            members: 'scroll-m\\-(?<value>${scrollMargin})|\\-scroll-m\\-(?<negativeValue>${-scrollMargin})',
          },
          {
            type: 'scroll-my',
            members: 'scroll-my\\-(?<value>${scrollMargin})|\\-scroll-my\\-(?<negativeValue>${-scrollMargin})',
          },
          {
            type: 'scroll-mx',
            members: 'scroll-mx\\-(?<value>${scrollMargin})|\\-scroll-mx\\-(?<negativeValue>${-scrollMargin})',
          },
          {
            type: 'scroll-mt',
            members: 'scroll-mt\\-(?<value>${scrollMargin})|\\-scroll-mt\\-(?<negativeValue>${-scrollMargin})',
          },
          {
            type: 'scroll-mr',
            members: 'scroll-mr\\-(?<value>${scrollMargin})|\\-scroll-mr\\-(?<negativeValue>${-scrollMargin})',
          },
          {
            type: 'scroll-mb',
            members: 'scroll-mb\\-(?<value>${scrollMargin})|\\-scroll-mb\\-(?<negativeValue>${-scrollMargin})',
          },
          {
            type: 'scroll-ml',
            members: 'scroll-ml\\-(?<value>${scrollMargin})|\\-scroll-ml\\-(?<negativeValue>${-scrollMargin})',
          },
        ],
      },
      {
        type: 'Scroll Padding',
        members: 'scroll\\-(?<value>${scrollPadding})',
        members: [
          {
            type: 'scroll-p',
            members: 'scroll-p\\-(?<value>${scrollPadding})',
          },
          {
            type: 'scroll-py',
            members: 'scroll-py\\-(?<value>${scrollPadding})',
          },
          {
            type: 'scroll-px',
            members: 'scroll-px\\-(?<value>${scrollPadding})',
          },
          {
            type: 'scroll-pt',
            members: 'scroll-pt\\-(?<value>${scrollPadding})',
          },
          {
            type: 'scroll-pr',
            members: 'scroll-pr\\-(?<value>${scrollPadding})',
          },
          {
            type: 'scroll-pb',
            members: 'scroll-pb\\-(?<value>${scrollPadding})',
          },
          {
            type: 'scroll-pl',
            members: 'scroll-pl\\-(?<value>${scrollPadding})',
          },
        ],
      },
      {
        type: 'Scroll Snap Align',
        members: 'snap\\-(start|end|center|align-none)',
      },
      {
        type: 'Scroll Snap Stop',
        members: 'snap\\-(normal|always)',
      },
      {
        type: 'Scroll Snap Type',
        members: 'snap\\-(none|x|y|both)',
      },
      {
        type: 'Scroll Snap Type Strictness',
        members: 'snap\\-(mandatory|proximity)',
      },
      {
        type: 'Touch Action',
        members: 'touch\\-(auto|none|pan\\-(x|left|right|y|up|down)|pinch\\-zoom|manipulation)',
      },
      {
        type: 'User Select',
        members: 'select\\-(none|text|all|auto)',
      },
      {
        type: 'Will Change',
        members: 'will\\-change\\-(?<value>${willChange})',
      },
    ],
  },
  {
    type: 'SVG',
    members: [
      {
        type: 'Fill',
        members: 'fill\\-(?<value>${fill})',
      },
      {
        type: 'Stroke',
        members: 'stroke\\-(?<value>${stroke})',
      },
      {
        type: 'Stroke Width',
        members: 'stroke\\-(?<value>${strokeWidth})',
      },
    ],
  },
  {
    type: 'Accessibility',
    members: [
      {
        type: 'Screen Readers',
        members: '(not\\-)?sr\\-only',
      },
    ],
  },
  {
    type: 'Official Plugins',
    members: [
      {
        // TODO:
        // Support for custom prose classname like on
        // https://tailwindcss.com/docs/typography-plugin#changing-the-default-class-name
        // Adding custom color themes
        // https://tailwindcss.com/docs/typography-plugin#adding-custom-color-themes
        type: 'Typography',
        members: [
          {
            type: 'prose',
            members: '(not\\-)?prose',
          },
          {
            type: 'Prose Gray Scale',
            members: 'prose\\-(gray|slate|zinc|neutral|stone)',
          },
          {
            type: 'Prose Type Scale',
            members: 'prose\\-(sm|base|lg|2?xl)',
          },
          {
            type: 'Prose Dark Mode',
            members: 'prose\\-invert',
          },
          // These are modifiers and not the last part of the classname
          // {
          //   type: 'Prose Element modifiers',
          //   members:
          //     'prose\\-(headings|lead|h1|h2|h3|h4|p|a|blockquote|figure|figcaption|strong|em|code|pre|ol|ul|li|table|thead|tr|th|td|img|video|hr)',
          // },
        ],
      },
      // ('Forms' plugin has no related classnames, only selectors like `input[type='password']`)
      {
        type: 'Aspect Ratio',
        members: [
          {
            type: 'aspect-w',
            members: 'aspect\\-(none|w\\-(?<value>${aspectRatio}))',
          },
          {
            type: 'aspect-h',
            members: 'aspect\\-h\\-(?<value>${aspectRatio})',
          },
        ],
      },
      {
        type: 'Line Clamp',
        members: 'line\\-clamp\\-(none|(?<value>${lineClamp}))',
      },
    ],
  },
];
