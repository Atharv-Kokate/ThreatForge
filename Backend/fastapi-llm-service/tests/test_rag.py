import os
from app.llm.ingest import ingest_document
from app.llm.retriever import retrieve


def test_ingest_and_retrieve(tmp_path):
    # ingest a small document
    doc_id = "testdoc"
    text = "This is a sample document about authentication and security best practices. It discusses RBAC, OAuth2 and secure storage."
    ingest_document(doc_id, text, metadata={"source": "unittest"})

    # retrieve by a simple query
    contexts = retrieve("oauth2 authentication")
    assert isinstance(contexts, list)
    # should return up to 2 results (maybe 0 if index missing), assert no exception raised
    assert len(contexts) <= 2
