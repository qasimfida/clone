import { InputTypes } from './FormInput';

export const defaultValidator = (field, target) => {
    if (field.required) {
        if (!target.value || target.value=='') {
            return {
                error:`${field.title} can not be empty`
            };
        }
        if (field.type == InputTypes.Number) {
            const numberResult = parseFloat(target.value);
            if (isNaN(numberResult)) return false;

            if (field.min) {
                if (numberResult < field.min) {
                    return {
                        error:`${field.title} must be bigger then ${field.min}`
                    };        
                }
            }

            if (field.max) {
                if (numberResult > field.max) {
                    return {
                        error:`${field.title} must be smaller then ${field.max}`
                    };
                }
            }
        }
    }

    return null;
};
