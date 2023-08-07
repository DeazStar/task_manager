class Features {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const excludedObj = ['page', 'sort', 'limit', 'fields'];
    const queryObj = { ...this.queryString };
    excludedObj.forEach((item) => delete queryObj[item]);

    if (queryObj.name) {
      console.log(this.queryObj.name);
      this.queryObj.name = new RegExp(`^${this.queryObj.name}`, 'i');
    }
    this.query = this.query.find(this.queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page || 1;
    const limit = this.queryString.limit || 10;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  excludePassword() {
    this.query = this.query.select('-password');

    return this;
  }
}

module.exports = Features;
