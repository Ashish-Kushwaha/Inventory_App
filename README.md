Inventory App

The project is a MERN-based Inventory & Sales Management Dashboard that enables businesses to manage products, invoices, and sales statistics efficiently. 

●      Centralized dashboard for monitoring sales, purchases, and inventory.

●      Product management with real-time stock status.

●      Invoice generation and transaction management.

●      Statistics visualization with charts.

●      Drag-and-drop customization of dashboard widgets (e.g., rearranging statistics cards, graphs, and tables).

Features

User Authentication: Users can register and log in to access all the platform's features.

Product Management

Invoice Management

Export invoice as PDF/Printable format.


Account can be back if user forgot password OTP will receive on Registered Email Id. 

Graph filters (Weekly/Monthly/Yearly).
The drag and drop functionality applied in home screen will be applied here too, but in horizontal sections.


Technologies Used
React.js
Node.js
Express.js
MongoDB

Backend is taking more time as expected please take care of that or please have patience.

In reset password flow don't refresh the page after Email sent other wise not able to get the account back

Demo Credentials

ashishkushwah@gmail.com

ashishkushwaha  :- password should be minimun 8 characters

Keep paid Invoices to track Sales criteria 

Product sold is identified by when quantity of the product gets 0 and which shows out-of-stock

Top 5 products are top 5 Out-of-stock product means that is sold product.

Quantiy> Threshold value gives In-stock

Quantiy< Threshold value gives low-stock

Product which are expired which shows expired 

After Login

We can add single product.

We can add multiple prroduct.

Invoice will generate as we add product

CSV File Demo Data

productName,category,price,quantity,unit,expiryDate,thresholdValue,availability

Apple,Food,50,100,kg,2025-12-31,10,In-stock
Banana,Food,20,200,kg,2025-12-25,20,In-stock



We can update the quantity of the product by clicking on the product a order modal appears and that can change the availabilty of the product and switch between 2 pages for rendering the changes 

one add the products purchase criteria will generate

On paid invoice unique reference number will generate then View and delete button will enable 

We can download the PDF of the generated invoice


We can drag and drop the widgets of the satistics and homepage 

On Refreshing the statistics page home please visit once as I  am storing on the redux for the state of the statistics gragh and top products.

On setting page we can change our info and on account management tab we can logout.
