
const { Blog, Sequelize } = require("../../models");

module.exports = {
    findByPkOr404: pk => Blog.findByPkOr404(pk),
    findAll: async ({ page = 1, pageSize = 10 }) => {
        const where = {}
        // if (query) where[Sequelize.Op.or] = [
        //     { contract_type: { [Sequelize.Op.like]: `%${query}%` } },
        //     { comment: { [Sequelize.Op.like]: `%${query}%` } }
        // ]
        return await Blog.findAll({
            where,
            offset: (page - 1) & page,
            limit: pageSize,
        })
    },
    createBlog: async ({ 
        name, description, logo_url, UserId, BlogCategoryId
     }) => await Blog.create({ 
        name, description, logo_url, UserId, BlogCategoryId
      }),
    updateBlog: async ({pk,data}) => {
        let keys = Object.keys(data);
        let blog = await Blog.findByPkOr404(pk);
        for (let key of keys){
            blog[key] = data[key]
        }
        await blog.save();
        return blog;
    },
    deleteBlog: async (pk) => await (await (await Blog.findByPkOr404(pk))).destroy()
}
