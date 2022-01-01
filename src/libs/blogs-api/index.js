// if (global.docs_collector) docs_collector.generalAddYAML(__dirname + "/docs.yaml")

const express = require("express");
const app = module.exports = express();

const { allowCrossDomain, validateRequest, jwtRequired, passUserFromJWT, adminRequired } = require("../../middlewares");

const { findAll, createBlog, updateBlog, deleteBlog, findByPkOr404 } = require("./blogs-dal");
const { ErrorHandler } = require("../../utils/error");

const yup = require("yup");
const { param_id, id } = require("../utils/validations");

app.use(allowCrossDomain)

const BlogFields = {
    name: yup.string(),
    description: yup.string(),
    logo_url: yup.string(),
    UserId: id,
    BlogCategoryId: id
}
const BlogFieldKeys = Object.keys(BlogFields)

app.get("/blogs", [
    jwtRequired, passUserFromJWT,
    validateRequest(yup.object().shape({
        query: yup.object().shape({
            page: yup.number().integer().positive().default(1),
            pageSize: yup.number().integer().positive().default(10),
            status: yup.string(),
            query: yup.string()
        })
    }))
], async (req,res) => {
    let blogs = await findAll(req.query); 
    return res.json({
        message: "success",
        code: 200,
        data: { blogs }
    })
})

app.get("/blogs/:blog_id", [
    validateRequest(yup.object().shape({
        params: yup.object().shape({
            blog_id: param_id.required()
        })
    }))
], async (req,res) => {
    const blog = await findByPkOr404(req.params.blog_id);
    return res.json({
        code: 200,
        message: "sucess",
        data: { blog }
    })
})


const createBlogFields = {};
BlogFieldKeys.map(key => createBlogFields[key] = BlogFields[key].required());
app.post("/blogs",[
    // jwtRequired, passUserFromJWT, adminRequired,
    validateRequest(yup.object().shape({
        requestBody: yup.object().shape(createBlogFields)
    }))
], async (req,res) => {
    let blog = await createBlog(req.body);
    return res.json({
        code: 200,
        message: "success",
        data: { blog }
    })
})

app.patch("/blogs/:blog_id", [
    jwtRequired, passUserFromJWT, adminRequired,
    validateRequest(yup.object().shape({
        requestBody: yup.object().shape(BlogFields),
        params: yup.object().shape({
            blog_id: param_id.required()
        })
    }))
], async (req,res) => {
    let blog = await updateBlog({
        pk: req.params.blog_id,
        data: req.body
    });
    return res.json({
        code: 200,
        message: "success",
        data: { blog }
    })
})

app.delete("/blogs/:blog_id", [
    jwtRequired, passUserFromJWT, adminRequired,
    validateRequest(yup.object().shape({
        params: yup.object().shape({
            blog_id: param_id.required()
        })
    }))
], async (req,res) => {
    await deleteBlog(req.params.blog_id)
    return res.json({
        code: 204,
        message: "success"
    })
})
