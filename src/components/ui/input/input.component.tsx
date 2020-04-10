/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import React from 'react';
import {
  ImageProps,
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Overwrite } from 'utility-types';
import {
  EvaSize,
  EvaStatus,
  FalsyFC,
  FalsyText,
  FlexStyleProps,
  PropsService,
  RenderProp,
  WebEventResponder,
  WebEventResponderCallbacks,
  WebEventResponderInstance,
} from '../../devsupport';
import {
  Interaction,
  styled,
  StyledComponentProps,
  StyleType,
} from '../../theme';
import { TextProps } from '../text/text.component';

type InputStyledProps = Overwrite<StyledComponentProps, {
  appearance?: 'default' | string;
}>;

export interface InputProps extends TextInputProps, InputStyledProps {
  status?: EvaStatus;
  size?: EvaSize;
  disabled?: boolean;
  label?: RenderProp<TextProps> | React.ReactText;
  caption?: RenderProp<TextProps> | React.ReactText;
  captionIcon?: RenderProp<Partial<ImageProps>>;
  accessoryLeft?: RenderProp<Partial<ImageProps>>;
  accessoryRight?: RenderProp<Partial<ImageProps>>;
  textStyle?: StyleProp<TextStyle>;
}

export type InputElement = React.ReactElement<InputProps>;

/**
 * Inputs let users enter and edit text.
 *
 * @extends React.Component
 *
 * @property {string} value - A value displayed in input field.
 *
 * @property {string} onChangeText - Called when the value should be changed.
 *
 * @property {() => void} onFocus - Called when input field becomes focused.
 *
 * @property {() => void} onBlur - Called when input field looses focus.
 *
 * @property {string} placeholder - A string to be displayed when there is no value.
 *
 * @property {boolean} disabled - Whether input field is disabled.
 * This property overrides `editable` property of TextInput.
 *
 * @property {ReactText | (TextProps) => ReactElement} label - String, number or a function component
 * to render above the input field.
 * If it is a function, expected to return a Text.
 *
 * @property {ReactText | (TextProps) => ReactElement} caption - String, number or a function component
 * to render below the input field.
 * If it is a function, expected to return a Text.
 *
 * @property {(ImageProps) => ReactElement} accessoryLeft - Function component
 * to render to start of the text.
 * Expected to return an Image.
 *
 * @property {(ImageProps) => ReactElement} accessoryRight - Function component
 * to render to end of the text.
 * Expected to return an Image.
 *
 * @property {(ImageProps) => ReactElement} captionIcon - Function component
 * to render to start of the *caption*.
 * Expected to return an Image.
 *
 * @property {string} status - Status of the component.
 * Can be `basic`, `primary`, `success`, `info`, `warning`, `danger` or `control`.
 * Defaults to *basic*.
 * Useful for giving user a hint on the input validity.
 * Use *control* status when needed to display within a contrast container.
 *
 * @property {string} size - Size of the component.
 * Can be `small`, `medium` or `large`.
 * Defaults to *medium*.
 *
 * @property {StyleProp<TextStyle>} textStyle - Customizes the style of the text field.
 *
 * @property {TextInputProps} ...TextInputProps - Any props applied to TextInput component.
 *
 * @overview-example InputSimpleUsage
 *
 * @overview-example InputStates
 * Input can be disabled with `disabled` property.
 *
 * @overview-example InputStatus
 * Or marked with `status` property, which is useful within forms validation.
 * An extra status is `control`, which is designed to be used on high-contrast backgrounds.
 *
 * @overview-example InputAccessories
 * Input may contain labels, captions and inner views by configuring `accessoryLeft` or `accessoryRight` properties.
 * Within Eva, Input accessories are expected to be images or [svg icons](guides/icon-packages).
 *
 * @overview-example InputSize
 * To resize Input, a `size` property may be used.
 *
 * @overview-example InputStyling
 * Input and it's inner views can be styled by passing them as function components.
 * ```
 * import { Input, Text } from '@ui-kitten/components';
 *
 * <Input
 *   textStyle={{ ... }}
 *   label={evaProps => <Text {...evaProps}>Label</Text>}
 *   caption={evaProps => <Text {...evaProps}>Caption</Text>}
 * />
 * ```
 *
 * @overview-example InputTheming
 * In most cases this is redundant, if [custom theme is configured](guides/branding).
 */
export class InputComponent extends React.Component<InputProps> implements WebEventResponderCallbacks {

  static styledComponentName: string = 'Input';

  private textInputRef = React.createRef<TextInput>();
  private webEventResponder: WebEventResponderInstance = WebEventResponder.create(this);

  public focus = (): void => {
    this.textInputRef.current?.focus();
  };

  public blur = (): void => {
    this.textInputRef.current?.blur();
  };

  public isFocused = (): boolean => {
    return this.textInputRef.current?.isFocused();
  };

  public clear = (): void => {
    this.textInputRef.current?.clear();
  };

  // WebEventResponderCallbacks

  public onMouseEnter = (): void => {
    this.props.eva.dispatch([Interaction.HOVER]);
  };

  public onMouseLeave = (): void => {
    this.props.eva.dispatch([]);
  };

  private onTextFieldFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    this.props.eva.dispatch([Interaction.FOCUSED]);
    this.props.onFocus && this.props.onFocus(event);
  };

  private onTextFieldBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    this.props.eva.dispatch([]);
    this.props.onBlur && this.props.onBlur(event);
  };

  private getComponentStyle = (source: StyleType) => {
    const flatStyles: ViewStyle = StyleSheet.flatten(this.props.style);
    const { rest: inputContainerStyle, ...containerStyle } = PropsService.allWithRest(flatStyles, FlexStyleProps);

    const {
      textMarginHorizontal,
      textFontFamily,
      textFontSize,
      textFontWeight,
      textColor,
      placeholderColor,
      iconWidth,
      iconHeight,
      iconMarginHorizontal,
      iconTintColor,
      labelColor,
      labelFontSize,
      labelMarginBottom,
      labelFontWeight,
      labelFontFamily,
      captionMarginTop,
      captionColor,
      captionFontSize,
      captionFontWeight,
      captionFontFamily,
      captionIconWidth,
      captionIconHeight,
      captionIconMarginRight,
      captionIconTintColor,
      ...containerParameters
    } = source;

    return {
      container: containerStyle,
      inputContainer: {
        ...containerParameters,
        ...inputContainerStyle,
      },
      captionContainer: {
        marginTop: captionMarginTop,
      },
      text: {
        marginHorizontal: textMarginHorizontal,
        fontFamily: textFontFamily,
        fontSize: textFontSize,
        fontWeight: textFontWeight,
        color: textColor,
      },
      placeholder: {
        color: placeholderColor,
      },
      icon: {
        width: iconWidth,
        height: iconHeight,
        marginHorizontal: iconMarginHorizontal,
        tintColor: iconTintColor,
      },
      label: {
        color: labelColor,
        fontSize: labelFontSize,
        marginBottom: labelMarginBottom,
        fontWeight: labelFontWeight,
        fontFamily: labelFontFamily,
      },
      captionIcon: {
        width: captionIconWidth,
        height: captionIconHeight,
        tintColor: captionIconTintColor,
        marginRight: captionIconMarginRight,
      },
      captionLabel: {
        fontSize: captionFontSize,
        fontWeight: captionFontWeight,
        fontFamily: captionFontFamily,
        color: captionColor,
      },
    };
  };

  public render(): React.ReactElement<ViewProps> {
    const {
      eva,
      textStyle,
      label,
      caption,
      accessoryLeft,
      accessoryRight,
      captionIcon,
      ...textInputProps
    } = this.props;

    const evaStyle = this.getComponentStyle(eva.style);

    return (
      <View style={evaStyle.container}>
        <FalsyText
          style={[evaStyle.label, styles.label]}
          component={label}
        />
        <View style={[evaStyle.inputContainer, styles.inputContainer]}>
          <FalsyFC
            style={evaStyle.icon}
            component={accessoryLeft}
          />
          <TextInput
            ref={this.textInputRef}
            placeholderTextColor={evaStyle.placeholder.color}
            {...textInputProps}
            {...this.webEventResponder.eventHandlers}
            style={[evaStyle.text, styles.text, platformStyles.text, textStyle]}
            editable={!textInputProps.disabled}
            onFocus={this.onTextFieldFocus}
            onBlur={this.onTextFieldBlur}
          />
          <FalsyFC
            style={evaStyle.icon}
            component={accessoryRight}
          />
        </View>
        <View style={[evaStyle.captionContainer, styles.captionContainer]}>
          <FalsyFC
            style={evaStyle.captionIcon}
            component={captionIcon}
          />
          <FalsyText
            style={[evaStyle.captionLabel, styles.captionLabel]}
            component={caption}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  captionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  label: {
    textAlign: 'left',
  },
  captionLabel: {
    textAlign: 'left',
  },
});

const platformStyles = StyleSheet.create({
  text: Platform.select({
    default: null,
    android: {
      paddingVertical: 0,
    },
    web: {
      outlineWidth: 0,
    },
  }),
});

export const Input = styled<InputProps>(InputComponent);