export class ApiFeatures {
    constructor(mongooseQuery , query){
        this.mongooseQuery = mongooseQuery
        this.query = query
    }

    //sort
    sort(){
        this.mongooseQuery.sort(this.query.sort)
        return this
    }
    //pagination
    pagination(){
        const {page = 1 , limit = 5} = this.query
        const skip = (page - 1) * limit ;
        this.mongooseQuery.skip(skip).limit(limit)
        return this

    }
    //filter
    filter(){
        const {page = 1 , limit = 5 , sort , ...filters} = this.query
        const filterAsString = JSON.stringify(filters)
        const replacedFilter = filterAsString.replaceAll(/gte|gt|lte|lt|regex|eq|ne|in|nin/g , (match) => `$${match}`)
        const parseFilter = JSON.parse(replacedFilter)
        this.mongooseQuery.find(parseFilter)
        return this
    }

}