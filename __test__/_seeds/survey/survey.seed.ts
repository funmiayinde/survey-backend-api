/* eslint-disable @typescript-eslint/camelcase */

/**
 * @return {Object} The main object
 **/
export const getSurveyObject = () => {
  return {
        name: 'What is your marital status?',
        options: [
            {
                description: 'Widow',
            },
            {
                description: 'Single',
            },
            {
                description: 'Living with my partner',
            },
            {
                description: 'In a registered relationship',
            }
        ]
    };
};
