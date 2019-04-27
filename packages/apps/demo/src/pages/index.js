import React from "react"

import Layout from "../components/layout/layout"
import SEO from "../components/layout/seo"

import IndexPage from "../components/pages/index"

export default () => (
  <Layout>
    <SEO title="Formally demo" />
    <IndexPage />
  </Layout>
)
