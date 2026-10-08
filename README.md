## Testing Methodology

The project uses a combination of automated testing, API testing with Swagger, and manual testing through the frontend.

Throughout the development process, Swagger was used repeatedly to test and verify the server-side functionality as individual features were implemented. This included testing CRUD operations against the database, checking request and response behaviour, and testing security-related functionality such as login, authentication, and retrieving information associated with the authenticated user's JWT. Swagger was therefore used continuously during the development of the different server-side tasks rather than only as a final verification step.

For automated testing, the backend contains an xUnit test project. The `OrderService` was selected as the main representative class because it contains several important business rules and database operations. The tests use an isolated SQLite in-memory database so that the tests can execute against the real LinqToDB database behaviour without modifying the application's normal database.

The automated tests cover the following purchase scenarios:

* A valid purchase creates an order and decreases the product inventory.
* Invalid quantities are rejected. A `[Theory]` is used to test both `0` and negative quantities because they represent the same validation rule with different input values.
* A purchase of a non-existing product is rejected.
* A user cannot buy their own product.
* A purchase is rejected when there is insufficient inventory.
* A successful purchase is verified by checking both the updated inventory and the created order.

Authorization was also tested with an automated controller test. The test verifies that a request without an authenticated user identity is rejected by the `UserController`'s `Me` endpoint.

Manual testing was also performed through the frontend throughout development. This was used not only to verify that the user flows worked, but also to identify integration problems between the frontend and backend. For example, during purchase testing we identified that the existing validation messages were being returned by the backend but were not being passed correctly through the exception handler to the frontend toast notifications. This allowed the issue to be identified and corrected as part of the development process.

The final manual regression check focused on the main purchasing flow:

`Products → Buy → Inventory → My Orders`

The manual test verified that a user could purchase another user's product, that the inventory was decreased by the purchased quantity, and that the resulting order appeared in the user's order history. A purchase with a quantity greater than one was also checked to ensure that both inventory and order quantity were updated correctly.

The purpose of combining these approaches is to test the application at different levels. Swagger provides direct and repeatable testing of the API while individual server-side features are being developed. Automated xUnit tests provide repeatable verification of important backend business rules and authorization behaviour. Manual frontend testing verifies the integration between the backend and frontend and helps identify issues that may not be visible when testing the API in isolation.
