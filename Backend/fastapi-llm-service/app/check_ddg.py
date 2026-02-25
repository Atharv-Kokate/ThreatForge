try:
    from duckduckgo_search import DDGS
    print("SUCCESS: duckduckgo_search is installed")
except ImportError:
    print("FAILURE: duckduckgo_search is NOT installed")
    try:
        from langchain_community.tools import DuckDuckGoSearchResults
        print("SUCCESS: langchain_community.tools.DuckDuckGoSearchResults is available")
    except ImportError:
        print("FAILURE: langchain_community is NOT available")
