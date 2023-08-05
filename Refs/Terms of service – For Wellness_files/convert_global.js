/** Shopify CDN: Minification failed

Line 16:0 Transforming let to the configured target environment ("es5") is not supported yet
Line 23:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 25:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 30:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 31:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 33:2 Transforming let to the configured target environment ("es5") is not supported yet
Line 35:4 Transforming let to the configured target environment ("es5") is not supported yet
Line 36:9 Transforming let to the configured target environment ("es5") is not supported yet
Line 51:4 Transforming let to the configured target environment ("es5") is not supported yet
Line 52:9 Transforming let to the configured target environment ("es5") is not supported yet
... and 1 more hidden warnings

**/
let session_cookie = convert.getCookie('_conv_s')
if (
  (JSON.stringify(convert.currentData.experiments) != '{}' ||
    JSON.stringify(convert.historicalData.experiments) != '{}') &&
  session_cookie
) {
  // Create a goal and change the id below
  let revenue_goal_id = '100322552'

  let session_id = session_cookie.substring(
    session_cookie.lastIndexOf('sh:') + 3,
    session_cookie.lastIndexOf('*')
  )

  let exp_list = []
  let variation_list = []

  let varID
  if (convert.currentData) {
    let new_exp = convert.currentData.experiments
    for (let expID in new_exp) {
      varID = new_exp[expID].variation_id
      if (!exp_list.includes(convert.data.experiments[expID].id)) {
        exp_list.push(convert.data.experiments[expID].id)
        variation_list.push(varID)
        console.debug(
          'Adding experiment: ' +
            convert.data.experiments[expID].id +
            ':' +
            varID
        )
      }
    }
  }
  if (convert.historicalData) {
    let old_exp = convert.historicalData.experiments
    for (let expID in old_exp) {
      varID = old_exp[expID].variation_id
      if (!exp_list.includes(convert.data.experiments[expID].id)) {
        exp_list.push(convert.data.experiments[expID].id)
        variation_list.push(varID)
        console.debug(
          'Adding experiment: ' +
            convert.data.experiments[expID].id +
            ':' +
            varID
        )
      }
    }
  }

  let convert_attributes = {
    __cid: convert.data.u_id,
    __pid: convert.data.prj.id,
    __vid: session_id,
    __goals: revenue_goal_id,
    __vars: variation_list,
    __exps: exp_list,
    __visitorSegments: JSON.stringify(convert.getVisitorSegments())
  }

  convert.$.post('/cart/update.js', {
    attributes: convert_attributes
  })
}
