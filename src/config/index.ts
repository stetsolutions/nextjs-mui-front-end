import * as yup from 'yup'

const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  nodeEnv: process.env.NODE_ENV
}

const schema = yup.object({
  apiUrl: yup.string().required(),
  nodeEnv: yup
    .string()
    .oneOf(['development', 'production', 'test'])
    .required()
})

const validated = schema.validateSync(config, { abortEarly: true })

export default validated
