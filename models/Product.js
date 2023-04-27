import {model, models, Schema} from 'mongoose'

const productShema = new Schema({
    title: {type:String, required:true},
    description: {type: String},
    price: {type: Number, required: true},
})

export const Product = models.Product || model('Product', productShema)