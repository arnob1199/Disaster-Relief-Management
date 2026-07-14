ALTER TABLE relief_requests
  MODIFY status ENUM('Pending', 'Approved', 'Distributed', 'Completed', 'Rejected')
  NOT NULL DEFAULT 'Pending';

UPDATE relief_requests
SET status = 'Completed'
WHERE status = 'Distributed';

ALTER TABLE relief_requests
  MODIFY status ENUM('Pending', 'Approved', 'Completed', 'Rejected')
  NOT NULL DEFAULT 'Pending';
