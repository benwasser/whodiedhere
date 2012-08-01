who died here
====================

Notable people's death location search
---------------------

The idea for this was salvaged from an expired domain (whodiedhere.com). It turns out there's no other service that allows you to find who died at a given location, even though Wikipedia does have all this data. I scraped dbpedia for the relevant data and made a JSON flatfile out of it to read into memory, since it's only 4mb worth of information. It uses Socket.IO to pep it up.

#### Installation:

Assumes you have Node.js installed. Install Express and Socket.IO: "npm install socket.io" and "npm install express"

If you're running it on port 80, you need to quit Apache first.

#### License:

MIT, whatever. If you can make money from this, you deserve it. Hopefully it can help people just starting out with Node, Socket.IO and Express to learn the basics.
