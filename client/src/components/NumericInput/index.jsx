import { Input, Tooltip } from 'antd';
import PT from "prop-types";
import "./index.css";

const formatNumber = (value) => new Intl.NumberFormat().format(value);

const NumericInput = (props) => {
    const { value, placeholder, onChange, afix = "" } = props;
    const handleChange = (e) => {
      const { value: inputValue } = e.target;
      const reg = /^-?\d*(\.\d*)?$/;
      if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
        onChange(inputValue);
      }
    };
  
    const handleBlur = () => {
      let valueTemp = value;
      if (value.charAt(value.length - 1) === '.' || value === '-') {
        valueTemp = value.slice(0, -1);
      }
      onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    };

    const title = value 
    ? (
        <span className="numeric-input-title">
            {value !== '—' ? formatNumber(Number(value))+` ${afix}` : '—'}
        </span>
    ) 
    : placeholder;

    return (
      <Tooltip trigger={['focus']} title={title} placement="topLeft" overlayClassName="numeric-input">
        <Input
          {...props}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxLength={16}
        />
      </Tooltip>
    );
};

  NumericInput.propTypes = {
    value: PT.any,
    placeholder: PT.string,
    onChange: PT.func,
    afix: PT.any,
  }
export default NumericInput