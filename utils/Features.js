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
}

module.exports = Features;
