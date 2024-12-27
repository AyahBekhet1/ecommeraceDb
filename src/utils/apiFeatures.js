 export class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  //pagination  ay 7aga btigi mn req.query btb2a string

  pagination() {
   
      let page = this.queryString.page * 1 || 1;
      if (page < 1) page = 1;
      let limit = 2;
      let skip = (page - 1) * limit;
      this.mongooseQuery.skip(skip).limit(limit);
        this.page =page
    return this;
  }

  filter() {
    let execludeQuery = ["page", "sort", "search", "select"];
    let filterQuery = { ...this.queryString }; //shallow copy
    execludeQuery.forEach((ele) => delete filterQuery[ele]);
    filterQuery = JSON.parse(
      JSON.stringify(filterQuery).replace(
        /gt|lt|gte|lte|eq/,
        (match) => `$${match}`
      )
    );
    this.mongooseQuery.find(filterQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery.sort(this.queryString.sort.replaceAll(",", " "));
    }
    return this;
  }
  //select  select=title,-_id y3ni 7ytl3 l title bs w msh 7ytl3 lid

  select() {
    if (this.queryString.select) {
      this.mongooseQuery.select(this.queryString.select.replaceAll(",", " "));
    }
    return this;
  }

  search() {
    if (this.queryString.search) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.search, $options: "i" } }, //y3ni case sensitive msh far2a
          { description: { $regex: this.queryString.search, $options: "i" } },
        ],
      });
    }
    return this;
  }
}
