"""Main File for the basic handlers."""

import json
import jinja2
import os
import webapp2


TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'templates')
JINJA_ENV = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMPLATE_DIR),
                               autoescape=True)


class BaseHandler(webapp2.RequestHandler):
  
  def render_str(self, template, params):
    t = JINJA_ENV.get_template(template)
    return t.render(params)

  def render(self, template, kw):
    self.response.out.write(self.render_str(template, kw))


class IndexHandler(BaseHandler):
  
  def get(self):
    state = self.request.get('state')
    if state:
      state_data = json.loads(state)
      # action = state_data['action']
      ids = map(str, state_data.get('ids', []))
      file_id = ids[0]
      userid = state_data['userId']
      self.redirect('/#fileIds=' + file_id + '&userId=' + userid)
    else:
      self.render('index.html', {})
         
app = webapp2.WSGIApplication([('/', IndexHandler), 
                              ], debug=True)